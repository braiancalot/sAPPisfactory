import {
  createProjectorContext,
  projectGoal,
} from "../goalProjectorService";
import { GlobalBalancesResult } from "@services/global-balance/globalBalance.types";

// Mock getItemData
jest.mock("@data/item", () => ({
  getItemData: (itemId: string) => ({ name: `Item: ${itemId}` }),
}));

// Helper to create mock production line
function createMockLine(
  id: string,
  outputItem: string,
  outputBaseRate: number,
  factoryName = "Test Factory"
) {
  return {
    id,
    outputItem,
    outputBaseRate,
    factory: {
      fetch: jest.fn().mockResolvedValue({ name: factoryName }),
    },
  } as any;
}

// Helper to create mock production line input
function createMockInput(
  id: string,
  productionLineId: string,
  inputItem: string,
  inputBaseRate: number,
  sourceType: "PRODUCTION_LINE" | "GLOBAL_SOURCE" | null = null,
  sourceId?: string
) {
  return {
    id,
    inputItem,
    inputBaseRate,
    sourceType,
    productionLine: { id: productionLineId },
    sourceProductionLine: { id: sourceType === "PRODUCTION_LINE" ? sourceId : null },
    globalSource: { id: sourceType === "GLOBAL_SOURCE" ? sourceId : null },
  } as any;
}

// Helper to create balances with minimal required fields
function createBalances(config: {
  lines?: Record<string, { balance: number; production?: number; consumption?: number }>;
  rates?: Record<string, { totalOutputRate: number }>;
  globalSources?: Record<string, { balance: number }>;
}): GlobalBalancesResult {
  const productionLines: GlobalBalancesResult["productionLines"] = {};
  const productionLineRates: GlobalBalancesResult["productionLineRates"] = {};
  const globalSources: GlobalBalancesResult["globalSources"] = {};

  if (config.lines) {
    for (const [id, data] of Object.entries(config.lines)) {
      productionLines[id] = {
        productionLineId: id,
        outputItem: "mock_item" as any,
        production: data.production ?? 0,
        consumption: data.consumption ?? 0,
        balance: data.balance,
      };
    }
  }

  if (config.rates) {
    for (const [id, data] of Object.entries(config.rates)) {
      productionLineRates[id] = {
        lineId: id,
        outputItem: "mock_item" as any,
        totalOutputRate: data.totalOutputRate,
        inputs: [],
      };
    }
  }

  if (config.globalSources) {
    for (const [id, data] of Object.entries(config.globalSources)) {
      globalSources[id] = {
        globalSourceId: id,
        item: "mock_item" as any,
        production: 0,
        consumption: 0,
        balance: data.balance,
      };
    }
  }

  return { productionLines, productionLineRates, globalSources };
}

describe("goalProjectorService", () => {
  describe("createProjectorContext", () => {
    it("should index lines by id", () => {
      const lines = [
        createMockLine("line1", "item_a", 10),
        createMockLine("line2", "item_b", 20),
      ];
      const context = createProjectorContext(lines, [], createBalances({}));

      expect(context.linesById["line1"]).toBe(lines[0]);
      expect(context.linesById["line2"]).toBe(lines[1]);
    });

    it("should group inputs by production line id", () => {
      const inputs = [
        createMockInput("i1", "line1", "item_x", 5),
        createMockInput("i2", "line1", "item_y", 3),
        createMockInput("i3", "line2", "item_z", 2),
      ];
      const context = createProjectorContext([], inputs, createBalances({}));

      expect(context.inputsByLineId["line1"]).toHaveLength(2);
      expect(context.inputsByLineId["line2"]).toHaveLength(1);
    });
  });

  describe("projectGoal", () => {
    describe("root node demand propagation", () => {
      it("should propagate demand to inputs even when root has positive balance", async () => {
        // This is the bug we fixed: root node with balance=5, producing 5/min
        // wants to produce 6/min. Should propagate 1/min demand to inputs.
        const lines = [
          createMockLine("root", "output_item", 10), // outputBaseRate
          createMockLine("input_line", "input_item", 10),
        ];

        const inputs = [
          createMockInput("i1", "root", "input_item", 5, "PRODUCTION_LINE", "input_line"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 5 },
            input_line: { balance: 10 },
          },
          rates: {
            root: { totalOutputRate: 5 },
            input_line: { totalOutputRate: 5 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 6, context);

        expect(result).not.toBeNull();
        expect(result!.requestedAmount).toBe(1); // 6 - 5 = 1 additional
        expect(result!.projectedBalance).toBe(6); // 5 + 1 = 6 for root
        expect(result!.children).toHaveLength(1);

        // The child should have requestedAmount > 0 because root needs more production
        const childNode = result!.children[0];
        expect(childNode.requestedAmount).toBeGreaterThan(0);
      });

      it("should not propagate demand when no additional production needed", async () => {
        const lines = [
          createMockLine("root", "output_item", 10),
          createMockLine("input_line", "input_item", 10),
        ];

        const inputs = [
          createMockInput("i1", "root", "input_item", 5, "PRODUCTION_LINE", "input_line"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 5 },
            input_line: { balance: 10 },
          },
          rates: {
            root: { totalOutputRate: 10 }, // Already producing 10
            input_line: { totalOutputRate: 5 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 6, context); // Want 6, already producing 10

        expect(result).not.toBeNull();
        expect(result!.requestedAmount).toBe(0); // No additional needed
        expect(result!.children[0].requestedAmount).toBe(0);
      });
    });

    describe("child node balance consideration", () => {
      it("should not require more production from child when child has sufficient balance", async () => {
        const lines = [
          createMockLine("root", "output_item", 10),
          createMockLine("child", "input_item", 10),
        ];

        const inputs = [
          createMockInput("i1", "root", "input_item", 5, "PRODUCTION_LINE", "child"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
            child: { balance: 100 }, // Plenty of balance
          },
          rates: {
            root: { totalOutputRate: 0 },
            child: { totalOutputRate: 5 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 10, context);

        expect(result).not.toBeNull();
        const childNode = result!.children[0];
        // Child has balance=100, demand is small, so projected balance should stay positive
        expect(childNode.status).toBe("OK");
        expect(childNode.projectedBalance).toBeGreaterThanOrEqual(0);
      });

      it("should show deficit when child balance is insufficient", async () => {
        const lines = [
          createMockLine("root", "output_item", 10),
          createMockLine("child", "input_item", 10),
        ];

        const inputs = [
          createMockInput("i1", "root", "input_item", 10, "PRODUCTION_LINE", "child"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
            child: { balance: 2 }, // Low balance
          },
          rates: {
            root: { totalOutputRate: 0 },
            child: { totalOutputRate: 0 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 10, context);

        expect(result).not.toBeNull();
        const childNode = result!.children[0];
        // Demand is 10, balance is 2, should be deficit
        expect(childNode.status).toBe("DEFICIT");
        expect(childNode.projectedBalance).toBeLessThan(0);
      });
    });

    describe("cycle detection", () => {
      it("should detect and handle cycles", async () => {
        const lines = [
          createMockLine("line_a", "item_a", 10),
          createMockLine("line_b", "item_b", 10),
        ];

        // line_a -> line_b -> line_a (cycle)
        const inputs = [
          createMockInput("i1", "line_a", "item_b", 5, "PRODUCTION_LINE", "line_b"),
          createMockInput("i2", "line_b", "item_a", 5, "PRODUCTION_LINE", "line_a"),
        ];

        const balances = createBalances({
          lines: {
            line_a: { balance: 0 },
            line_b: { balance: 0 },
          },
          rates: {
            line_a: { totalOutputRate: 0 },
            line_b: { totalOutputRate: 0 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("line_a", 10, context);

        expect(result).not.toBeNull();

        // Find the cycle node (should be in grandchildren)
        const lineB = result!.children[0];
        expect(lineB.children).toHaveLength(1);

        const cycleNode = lineB.children[0];
        expect(cycleNode.status).toBe("CYCLE_DETECTED");
        expect(cycleNode.sourceType).toBe("CYCLE");
      });
    });

    describe("global source inputs", () => {
      it("should handle global source inputs correctly", async () => {
        const lines = [createMockLine("root", "output_item", 10)];

        const inputs = [
          createMockInput("i1", "root", "raw_item", 5, "GLOBAL_SOURCE", "gs1"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
          },
          rates: {
            root: { totalOutputRate: 0 },
          },
          globalSources: {
            gs1: { balance: 20 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 10, context);

        expect(result).not.toBeNull();
        expect(result!.children).toHaveLength(1);

        const gsNode = result!.children[0];
        expect(gsNode.sourceType).toBe("GLOBAL_SOURCE");
        expect(gsNode.globalSourceId).toBe("gs1");
        expect(gsNode.currentBalance).toBe(20);
        expect(gsNode.status).toBe("OK");
      });

      it("should show deficit for global source with insufficient balance", async () => {
        const lines = [createMockLine("root", "output_item", 10)];

        const inputs = [
          createMockInput("i1", "root", "raw_item", 10, "GLOBAL_SOURCE", "gs1"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
          },
          rates: {
            root: { totalOutputRate: 0 },
          },
          globalSources: {
            gs1: { balance: 2 }, // Low balance
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 10, context);

        const gsNode = result!.children[0];
        expect(gsNode.status).toBe("DEFICIT");
        expect(gsNode.projectedBalance).toBeLessThan(0);
      });
    });

    describe("unlinked inputs", () => {
      it("should handle unlinked inputs with WARNING status", async () => {
        const lines = [createMockLine("root", "output_item", 10)];

        const inputs = [
          createMockInput("i1", "root", "unknown_item", 5, null), // No source
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
          },
          rates: {
            root: { totalOutputRate: 0 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 10, context);

        expect(result).not.toBeNull();
        expect(result!.children).toHaveLength(1);

        const unlinkedNode = result!.children[0];
        expect(unlinkedNode.sourceType).toBe("UNLINKED");
        expect(unlinkedNode.status).toBe("WARNING");
        expect(unlinkedNode.currentBalance).toBe(0);
      });
    });

    describe("input ratio calculation", () => {
      it("should calculate input demand based on output/input ratio", async () => {
        const lines = [
          createMockLine("root", "output_item", 10), // produces 10/min base
          createMockLine("child", "input_item", 20),
        ];

        // Input requires 5/min for every 10/min output (ratio = 0.5)
        const inputs = [
          createMockInput("i1", "root", "input_item", 5, "PRODUCTION_LINE", "child"),
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
            child: { balance: 0 },
          },
          rates: {
            root: { totalOutputRate: 0 },
            child: { totalOutputRate: 0 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 20, context); // Want 20/min output

        expect(result).not.toBeNull();
        // 20/min output needs (5/10) * 20 = 10/min input
        const childNode = result!.children[0];
        expect(childNode.requestedAmount).toBe(10);
      });
    });

    describe("multiple inputs", () => {
      it("should handle multiple inputs with different sources", async () => {
        const lines = [
          createMockLine("root", "output_item", 10),
          createMockLine("line_a", "item_a", 10),
        ];

        const inputs = [
          createMockInput("i1", "root", "item_a", 4, "PRODUCTION_LINE", "line_a"),
          createMockInput("i2", "root", "item_b", 2, "GLOBAL_SOURCE", "gs1"),
          createMockInput("i3", "root", "item_c", 1, null), // Unlinked
        ];

        const balances = createBalances({
          lines: {
            root: { balance: 0 },
            line_a: { balance: 0 },
          },
          rates: {
            root: { totalOutputRate: 0 },
            line_a: { totalOutputRate: 0 },
          },
          globalSources: {
            gs1: { balance: 50 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const result = await projectGoal("root", 10, context);

        expect(result).not.toBeNull();
        expect(result!.children).toHaveLength(3);

        const types = result!.children.map((c) => c.sourceType);
        expect(types).toContain("PRODUCTION_LINE");
        expect(types).toContain("GLOBAL_SOURCE");
        expect(types).toContain("UNLINKED");
      });
    });

    describe("nonexistent line", () => {
      it("should return null for nonexistent line id", async () => {
        const context = createProjectorContext([], [], createBalances({}));
        const result = await projectGoal("nonexistent", 10, context);

        expect(result).toBeNull();
      });
    });

    describe("cumulative demand across simulation state", () => {
      it("should accumulate demand in simulation state for shared sources", async () => {
        const lines = [
          createMockLine("line_a", "item_a", 10),
          createMockLine("line_b", "item_b", 10),
          createMockLine("shared", "shared_item", 10),
        ];

        // Both line_a and line_b use shared as input
        const inputs = [
          createMockInput("i1", "line_a", "shared_item", 5, "PRODUCTION_LINE", "shared"),
          createMockInput("i2", "line_b", "shared_item", 5, "PRODUCTION_LINE", "shared"),
        ];

        const balances = createBalances({
          lines: {
            line_a: { balance: 0 },
            line_b: { balance: 0 },
            shared: { balance: 5 },
          },
          rates: {
            line_a: { totalOutputRate: 0 },
            line_b: { totalOutputRate: 0 },
            shared: { totalOutputRate: 0 },
          },
        });

        const context = createProjectorContext(lines, inputs, balances);
        const simulationState: { demandedTotal: Record<string, number> } = { demandedTotal: {} };

        // First projection
        await projectGoal("line_a", 10, context, simulationState);

        // Shared line should have accumulated demand
        expect(simulationState.demandedTotal["shared"]).toBe(5);

        // Second projection with same state
        await projectGoal("line_b", 10, context, simulationState);

        // Demand should be cumulative
        expect(simulationState.demandedTotal["shared"]).toBe(10);
      });
    });
  });
});

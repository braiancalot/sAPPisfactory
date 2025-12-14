import { ItemId } from "@data/item";

export type SimulationNodeStatus =
  | "OK"
  | "DEFICIT"
  | "CYCLE_DETECTED"
  | "WARNING";

export type SimulationNode = {
  id: string;
  itemId: ItemId;
  itemName: string;

  requestedAmount: number;
  currentBalance: number;
  projectedBalance: number;

  sourceType: "PRODUCTION_LINE" | "GLOBAL_SOURCE" | "UNLINKED" | "CYCLE";
  sourceName: string;
  productionLineId?: string;
  globalSourceId?: string;

  status: SimulationNodeStatus;
  children: SimulationNode[];
};

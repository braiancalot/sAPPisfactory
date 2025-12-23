import { getItemData } from "@data/item";
import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import { GlobalBalancesResult } from "@services/global-balance/globalBalance.types";
import { SimulationNode, SimulationNodeStatus } from "./goalProjector.types";

type ProjectorContext = {
  linesById: Record<string, ProductionLine>;
  inputsByLineId: Record<string, ProductionLineInput[]>;
  balances: GlobalBalancesResult;
};

type SimulationState = {
  demandedTotal: Record<string, number>;
};

export function createProjectorContext(
  lines: ProductionLine[],
  inputs: ProductionLineInput[],
  balances: GlobalBalancesResult
): ProjectorContext {
  const linesById: Record<string, ProductionLine> = {};
  lines.forEach((line) => {
    linesById[line.id] = line;
  });

  const inputsByLineId: Record<string, ProductionLineInput[]> = {};
  inputs.forEach((input) => {
    if (!inputsByLineId[input.productionLine.id]) {
      inputsByLineId[input.productionLine.id] = [];
    }
    inputsByLineId[input.productionLine.id].push(input);
  });

  return { linesById, inputsByLineId, balances };
}

export async function projectGoal(
  targetLineId: string,
  targetRate: number,
  context: ProjectorContext,
  simulationState: SimulationState = { demandedTotal: {} },
  visitedItems = new Set<string>(),
  depth = 0
): Promise<SimulationNode | null> {
  const line = context.linesById[targetLineId];
  if (!line) return null;

  const isRootNode = depth === 0;
  const itemData = getItemData(line.outputItem);

  if (visitedItems.has(line.id)) {
    return {
      id: `${line.id}-${depth}-cycle`,
      itemId: line.outputItem,
      itemName: `Ciclo: ${itemData.name}`,
      requestedAmount: 0,
      currentBalance: 0,
      projectedBalance: 0,
      sourceType: "CYCLE",
      sourceName: "Ciclo detectado",
      productionLineId: line.id,
      status: "CYCLE_DETECTED",
      children: [],
    };
  }

  const newVisited = new Set(visitedItems);
  newVisited.add(line.id);

  const currentLineStats = context.balances.productionLineRates[line.id];
  const currentProduction = currentLineStats?.totalOutputRate ?? 0;
  const addedDemand = Math.max(0, targetRate - currentProduction);

  const previousLineDemand = simulationState.demandedTotal[line.id] || 0;
  simulationState.demandedTotal[line.id] = previousLineDemand + addedDemand;
  const totalLineDemand = simulationState.demandedTotal[line.id];

  const globalBalance = context.balances.productionLines[line.id];
  const currentGlobalBalance = globalBalance?.balance ?? 0;
  const projectedBalance = isRootNode
    ? currentGlobalBalance + addedDemand
    : currentGlobalBalance - totalLineDemand;

  let status: SimulationNodeStatus = projectedBalance < 0 ? "DEFICIT" : "OK";

  const unmetDemand = Math.max(0, totalLineDemand - currentGlobalBalance);

  const children: SimulationNode[] = [];
  const lineInputs = context.inputsByLineId[line.id] ?? [];

  for (const input of lineInputs) {
    const ratio =
      line.outputBaseRate > 0 ? input.inputBaseRate / line.outputBaseRate : 0;

    const inputDemandIncrease = unmetDemand * ratio;

    if (
      input.sourceType === "PRODUCTION_LINE" &&
      input.sourceProductionLine.id
    ) {
      const sourceLineId = input.sourceProductionLine.id;
      const sourceLineStats =
        context.balances.productionLineRates[sourceLineId];
      const sourceCurrentProd = sourceLineStats?.totalOutputRate ?? 0;

      const childTargetRate = sourceCurrentProd + inputDemandIncrease;

      const childNode = await projectGoal(
        sourceLineId,
        childTargetRate,
        context,
        simulationState,
        newVisited,
        depth + 1
      );

      if (childNode) children.push(childNode);
    } else if (input.sourceType === "GLOBAL_SOURCE" && input.globalSource.id) {
      const gsId = input.globalSource.id;
      const gsBalance = context.balances.globalSources[gsId];
      const currentGSBalance = gsBalance?.balance ?? 0;

      const previousDemand = simulationState.demandedTotal[gsId] || 0;
      simulationState.demandedTotal[gsId] =
        previousDemand + inputDemandIncrease;

      const totalDemandOnSimulation = simulationState.demandedTotal[gsId];
      const projectedGSBalance = currentGSBalance - totalDemandOnSimulation;

      const inputItemData = getItemData(input.inputItem);

      children.push({
        id: `${gsId}-${depth}`,
        itemId: input.inputItem,
        itemName: inputItemData.name,
        requestedAmount: inputDemandIncrease,
        currentBalance: currentGSBalance,
        projectedBalance: projectedGSBalance,
        sourceType: "GLOBAL_SOURCE",
        sourceName: "Fonte Global",
        globalSourceId: gsId,
        status: projectedGSBalance < 0 ? "DEFICIT" : "OK",
        children: [],
      });
    } else {
      const inputItemData = getItemData(input.inputItem);
      children.push({
        id: `unlinked-${input.id}-${depth}`,
        itemId: input.inputItem,
        itemName: inputItemData.name,
        requestedAmount: inputDemandIncrease,
        currentBalance: 0,
        projectedBalance: -inputDemandIncrease,
        sourceType: "UNLINKED",
        sourceName: "Sem origem definida",
        status: "WARNING",
        children: [],
      });
    }
  }

  const factoryName = (await line.factory.fetch()).name;

  return {
    id: `${line.id}-${depth}`,
    itemId: line.outputItem,
    itemName: itemData.name,
    requestedAmount: addedDemand,
    currentBalance: currentGlobalBalance,
    projectedBalance,
    sourceType: "PRODUCTION_LINE",
    sourceName: factoryName ?? "Linha de Produção",
    productionLineId: line.id,
    status,
    children,
  };
}

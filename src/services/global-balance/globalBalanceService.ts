import GlobalSource from "@db/model/GlobalSource";
import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import ScaleGroup from "@db/model/ScaleGroup";

import { ItemId } from "@data/item";

import {
  GlobalBalancesResult,
  GlobalSourceBalance,
  LineTotalRates,
  ProductionLineBalance,
} from "./globalBalance.types";

export type LineMultipliers = {
  inputMultiplier: number;
  outputMultiplier: number;
};

export function computeGlobalSources(
  globalSources: GlobalSource[],
  productionLines: ProductionLine[],
  inputs: ProductionLineInput[],
  scaleGroups: ScaleGroup[]
): GlobalBalancesResult {
  const inputsByLine: Record<string, ProductionLineInput[]> = {};
  for (const input of inputs) {
    if (!inputsByLine[input.productionLine.id]) {
      inputsByLine[input.productionLine.id] = [];
    }
    inputsByLine[input.productionLine.id].push(input);
  }

  const groupsByLine: Record<string, ScaleGroup[]> = {};
  for (const groups of scaleGroups) {
    if (!groupsByLine[groups.productionLine.id]) {
      groupsByLine[groups.productionLine.id] = [];
    }
    groupsByLine[groups.productionLine.id].push(groups);
  }

  const lineRates: Record<string, LineTotalRates> = {};
  for (const line of productionLines) {
    const lineInputs = inputsByLine[line.id] ?? [];
    const lineGroups = groupsByLine[line.id] ?? [];

    lineRates[line.id] = computeLineTotalRates(line, lineInputs, lineGroups);
  }

  const globalSourceBalances: Record<string, GlobalSourceBalance> = {};
  for (const gs of globalSources) {
    globalSourceBalances[gs.id] = {
      globalSourceId: gs.id,
      item: gs.item,
      production: gs.totalRatePerMin,
      consumption: 0,
      balance: gs.totalRatePerMin,
    };
  }

  for (const input of inputs) {
    if (input.sourceType === "GLOBAL_SOURCE" && input.globalSource.id) {
      const consumerLineRate = lineRates[input.productionLine.id];
      if (!consumerLineRate) continue;

      const lineInputRate = consumerLineRate.inputs.find(
        (i) => i.inputItem === input.inputItem
      );

      if (!lineInputRate) continue;

      const gsBalance = globalSourceBalances[input.globalSource.id];
      if (!gsBalance) continue;

      gsBalance.consumption += lineInputRate.totalInputRate;
      gsBalance.balance = gsBalance.production - gsBalance.consumption;
    }
  }

  const lineBalances: Record<string, ProductionLineBalance> = {};
  for (const line of productionLines) {
    const rates = lineRates[line.id];

    lineBalances[line.id] = {
      productionLineId: line.id,
      outputItem: line.outputItem,
      production: rates.totalOutputRate,
      consumption: 0,
      balance: rates.totalOutputRate,
    };
  }

  for (const input of inputs) {
    if (
      input.sourceType === "PRODUCTION_LINE" &&
      input.sourceProductionLine.id
    ) {
      const consumerLineRate = lineRates[input.productionLine.id];
      if (!consumerLineRate) continue;

      const lineInputRate = consumerLineRate.inputs.find(
        (i) => i.inputItem === input.inputItem
      );

      if (!lineInputRate) continue;

      const lineBalance = lineBalances[input.sourceProductionLine.id];
      if (!lineBalance) continue;

      lineBalance.consumption += lineInputRate.totalInputRate;
      lineBalance.balance = lineBalance.production - lineBalance.consumption;
    }
  }

  return {
    globalSources: globalSourceBalances,
    productionLines: lineBalances,
    productionLineRates: lineRates,
  };
}

function computeLineTotalRates(
  line: ProductionLine,
  lineInputs: ProductionLineInput[],
  lineGroups: ScaleGroup[]
): LineTotalRates {
  const { inputMultiplier, outputMultiplier } =
    computeLineMultipliers(lineGroups);

  const totalOutputRate = line.outputBaseRate * outputMultiplier;

  const inputs = lineInputs.map((input) => ({
    inputItem: input.inputItem,
    totalInputRate: input.inputBaseRate * inputMultiplier,
  }));

  return {
    lineId: line.id,
    outputItem: line.outputItem,
    totalOutputRate,
    inputs,
  };
}

function computeLineMultipliers(groups: ScaleGroup[]): LineMultipliers {
  let inputMultiplier = 0;
  let outputMultiplier = 0;

  for (const group of groups) {
    const clockFactor = group.clockSpeedPercent / 100;

    const base = group.moduleCount * clockFactor;

    inputMultiplier += base;
    outputMultiplier += base + group.somersloopCount * 0.25;
  }

  return { inputMultiplier, outputMultiplier };
}

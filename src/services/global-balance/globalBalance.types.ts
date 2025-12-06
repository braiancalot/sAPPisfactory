import { ItemId } from "@data/item";

export type LineTotalRates = {
  lineId: string;
  outputItem: ItemId;
  totalOutputRate: number;
  inputs: {
    inputItem: ItemId;
    totalInputRate: number;
  }[];
};

export type GlobalSourceBalance = {
  globalSourceId: string;
  item: ItemId;
  production: number;
  consumption: number;
  balance: number;
};

export type ProductionLineBalance = {
  productionLineId: string;
  outputItem: ItemId;
  production: number;
  consumption: number;
  balance: number;
};

export type GlobalBalancesResult = {
  globalSources: Record<string, GlobalSourceBalance>;
  productionLines: Record<string, ProductionLineBalance>;
  productionLineRates: Record<string, LineTotalRates>;
};

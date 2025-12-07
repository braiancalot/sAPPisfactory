import { createContext, useContext, useEffect, useState } from "react";
import { combineLatest, map } from "rxjs";

import database, {
  globalSourcesCollection,
  productionLineInputsCollection,
  productionLinesCollection,
  scaleGroupsCollection,
} from "@db/index";

import { computeGlobalSources } from "@services/global-balance/globalBalanceService";

import {
  GlobalBalancesResult,
  GlobalSourceBalance,
  LineTotalRates,
  ProductionLineBalance,
} from "@services/global-balance/globalBalance.types";

type GlobalBalanceContextType = {
  balances: GlobalBalancesResult | null;
  getGlobalSourceBalance: (id: string) => GlobalSourceBalance | undefined;
  getProductionLineBalance: (id: string) => ProductionLineBalance | undefined;
  getProductionLineRates: (id: string) => LineTotalRates | undefined;
};

const GlobalBalanceContext = createContext<GlobalBalanceContextType | null>(
  null
);

export function GlobalBalanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [balances, setBalances] = useState<GlobalBalancesResult | null>(null);

  useEffect(() => {
    const globalSources$ = globalSourcesCollection
      .query()
      .observeWithColumns(["total_rate_per_min"]);
    const productionLines$ = productionLinesCollection
      .query()
      .observeWithColumns(["output_base_rate"]);
    const inputs$ = productionLineInputsCollection
      .query()
      .observeWithColumns([
        "input_base_rate",
        "global_source_id",
        "source_production_line_id",
      ]);
    const scaleGroups$ = scaleGroupsCollection
      .query()
      .observeWithColumns([
        "module_count",
        "clock_speed_percent",
        "somersloop_count",
      ]);

    const subscription = combineLatest([
      globalSources$,
      productionLines$,
      inputs$,
      scaleGroups$,
    ])
      .pipe(
        map(([globalSources, productionLines, inputs, scaleGroups]) => {
          return computeGlobalSources(
            globalSources,
            productionLines,
            inputs,
            scaleGroups
          );
        })
      )
      .subscribe((newBalances) => setBalances(newBalances));

    return () => subscription.unsubscribe();
  }, [database]);

  function getGlobalSourceBalance(id: string) {
    return balances?.globalSources[id];
  }

  function getProductionLineBalance(id: string) {
    return balances?.productionLines[id];
  }

  function getProductionLineRates(id: string) {
    return balances?.productionLineRates[id];
  }

  return (
    <GlobalBalanceContext.Provider
      value={{
        balances,
        getGlobalSourceBalance,
        getProductionLineBalance,
        getProductionLineRates,
      }}
    >
      {children}
    </GlobalBalanceContext.Provider>
  );
}

export function useGlobalBalance() {
  const context = useContext(GlobalBalanceContext);
  if (!context) {
    throw new Error(
      "useGlobalBalance must be used within a GlobalBalanceProvider"
    );
  }
  return context;
}

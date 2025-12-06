import { useEffect, useState } from "react";
import { combineLatest, map } from "rxjs";

import database, {
  globalSourcesCollection,
  productionLineInputsCollection,
  productionLinesCollection,
  scaleGroupsCollection,
} from "@db/index";

import { computeGlobalSources } from "@services/global-balance/globalBalanceService";
import { GlobalBalancesResult } from "@services/global-balance/globalBalance.types";

export function useGlobalBalances() {
  const [balances, setBalances] = useState<GlobalBalancesResult | null>(null);

  useEffect(() => {
    const globalSources$ = globalSourcesCollection.query().observe();
    const productionLines$ = productionLinesCollection.query().observe();
    const inputs$ = productionLineInputsCollection.query().observe();
    const scaleGroups$ = scaleGroupsCollection.query().observe();

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

  return balances;
}

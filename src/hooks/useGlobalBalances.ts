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

  return balances;
}

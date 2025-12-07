import {
  productionLineInputsCollection,
  productionLinesCollection,
} from "@db/index";

import { useGlobalBalance } from "@hooks/useGlobalBalance";
import {
  createProjectorContext,
  projectGoal,
} from "@services/goal-projector/goalProjectorService";

import ScreenContainer from "@ui/ScreenContainer";
import { useEffect } from "react";

export default function ProjectorScreen() {
  const { balances } = useGlobalBalance();

  useEffect(() => {
    handlePress();
  }, []);

  async function handlePress() {
    if (!balances) return;

    const productionLine =
      await productionLinesCollection.find("CmtpJdhnO4uUipiy");

    console.log(
      "\n== Calculando impacto ==\n",
      JSON.stringify(
        {
          id: productionLine.id,
          item: productionLine.outputItem,
          baseRate: productionLine.outputBaseRate,
        },
        null,
        2
      )
    );

    const productionLines = await productionLinesCollection.query().fetch();
    const productionLineInputs = await productionLineInputsCollection
      .query()
      .fetch();

    const context = createProjectorContext(
      productionLines,
      productionLineInputs,
      balances
    );

    const result = projectGoal(productionLine.id, 5, context);
    console.log(JSON.stringify(result, null, 2));
  }

  return (
    <ScreenContainer>
      <Button title="Calcular impacto" onPress={handlePress} />
    </ScreenContainer>
  );
}

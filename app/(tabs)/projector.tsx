import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import {
  productionLineInputsCollection,
  productionLinesCollection,
} from "@db/index";

import { useGlobalBalance } from "@hooks/useGlobalBalance";
import { SimulationNode } from "@services/goal-projector/goalProjector.types";
import {
  createProjectorContext,
  projectGoal,
} from "@services/goal-projector/goalProjectorService";

import ScreenContainer from "@ui/ScreenContainer";
import Button from "@ui/Button";

import DependencyTree from "@features/projector/DependencyTree";

export default function ProjectorScreen() {
  const [simulationTree, setSimulationTree] = useState<SimulationNode | null>(
    null
  );

  const { balances } = useGlobalBalance();

  useEffect(() => {
    project();
  }, [balances]);

  async function project() {
    if (!balances) return;

    const productionLine =
      await productionLinesCollection.find("CmtpJdhnO4uUipiy");

    const productionLines = await productionLinesCollection.query().fetch();
    const productionLineInputs = await productionLineInputsCollection
      .query()
      .fetch();

    const context = createProjectorContext(
      productionLines,
      productionLineInputs,
      balances
    );

    const tree = projectGoal(productionLine.id, 8, context);
    setSimulationTree(tree);
  }

  async function handlePress() {
    await project();
  }

  return (
    <ScreenContainer>
      <Button title="Calcular impacto" onPress={handlePress} />
      {simulationTree && (
        <ScrollView className="px-sm mt-lg">
          <DependencyTree node={simulationTree} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

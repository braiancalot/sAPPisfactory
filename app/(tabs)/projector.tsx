import { useMemo, useState } from "react";
import { Keyboard, View } from "react-native";
import * as Haptics from "expo-haptics";

import {
  productionLineInputsCollection,
  productionLinesCollection,
} from "@db/index";
import ProductionLine from "@db/model/ProductionLine";

import { useGlobalBalance } from "@hooks/useGlobalBalance";
import { SimulationNode } from "@services/goal-projector/goalProjector.types";
import {
  createProjectorContext,
  projectGoal,
} from "@services/goal-projector/goalProjectorService";
import { parsePtBrNumber } from "src/utils/numberFormat";

import ScrollScreenContainer from "@ui/ScrollScreenContainer";
import RateDisplay from "@ui/RateDisplay";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Card from "@ui/Card";
import Text from "@ui/Text";
import ProductionLinePicker from "@features/projector/ProductionLinePicker";
import DependencyTree from "@features/projector/DependencyTree";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

export default function ProjectorScreen() {
  const [selectedProductionLine, setSelectedProductionLine] =
    useState<ProductionLine | null>(null);
  const [targetRateStr, setTargetRateStr] = useState("");
  const [simulationTree, setSimulationTree] = useState<SimulationNode | null>(
    null
  );

  const { balances } = useGlobalBalance();

  const currentSummary = useMemo(() => {
    if (!selectedProductionLine || !balances) return null;

    return balances.productionLines[selectedProductionLine.id];
  }, [selectedProductionLine, balances]);

  const projectedDelta = useMemo(() => {
    if (!currentSummary || !targetRateStr) return 0;
    const target = parsePtBrNumber(targetRateStr);
    return target - currentSummary.production;
  }, [currentSummary, targetRateStr]);

  const isTargetValid = projectedDelta > 0.0001;

  async function handleProject() {
    Keyboard.dismiss();
    if (!selectedProductionLine || !balances || !isTargetValid) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setSimulationTree(null);
    // loading

    const targetRate = parsePtBrNumber(targetRateStr);

    const productionLines = await productionLinesCollection.query().fetch();
    const productionLineInputs = await productionLineInputsCollection
      .query()
      .fetch();

    const context = createProjectorContext(
      productionLines,
      productionLineInputs,
      balances
    );

    const tree = projectGoal(selectedProductionLine.id, targetRate, context);
    setSimulationTree(tree);
  }

  return (
    <ScrollScreenContainer>
      <Card className="p-md gap-lg mx-md mt-lg">
        <View>
          <ProductionLinePicker
            label="Linha base"
            selected={selectedProductionLine}
            onSelect={setSelectedProductionLine}
          />
        </View>

        {currentSummary && (
          <>
            <View className="flex-row justify-between px-xs -mt-md">
              <View className="flex-row gap-2xs items-baseline">
                <Text variant="caption" className="text-text-tertiary">
                  Produção atual:
                </Text>
                <RateDisplay
                  value={currentSummary.production}
                  colored={false}
                />
              </View>

              <View className="flex-row gap-2xs items-baseline">
                <Text variant="caption" className="text-text-tertiary">
                  Saldo:
                </Text>
                <RateDisplay value={currentSummary.balance} size="sm" />
              </View>
            </View>

            <View>
              <Input
                label="Nova meta de produção"
                placeholder={
                  currentSummary
                    ? `Ex: ${Math.ceil(currentSummary.production * 1.5)}`
                    : "Ex: 20"
                }
                numeric
                value={targetRateStr}
                onChangeValue={setTargetRateStr}
                onSubmit={handleProject}
              />

              {targetRateStr !== "" && currentSummary && (
                <Text
                  variant="caption"
                  className={`mt-xs ml-xs ${isTargetValid ? "text-text-secondary" : "text-warning"}`}
                >
                  {isTargetValid
                    ? `Isso adiciona +${projectedDelta}/min à demanda`
                    : "Meta inferior ou igual à produção atual. Aumente o valor."}
                </Text>
              )}
            </View>
          </>
        )}

        <Button
          title="Calcular impacto"
          onPress={handleProject}
          disabled={!selectedProductionLine || !isTargetValid}
        />
      </Card>

      <View className="p-md mt-xl">
        {simulationTree ? (
          <View>
            <View className="flex-row items-center justify-between mb-md">
              <Text variant="subhead" className="text-text-secondary uppercase">
                Relatório de impacto
              </Text>

              <View
                className={`px-sm py-2xs rounded-pill ${simulationTree.status === "OK" ? "bg-success/20" : "bg-danger/20"}`}
              >
                <Text
                  variant="caption"
                  className={
                    simulationTree.status === "OK"
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {simulationTree.status === "OK"
                    ? "SISTEMA ESTÁVEL"
                    : "GARGALOS ENCONTRADOS"}
                </Text>
              </View>
            </View>

            <DependencyTree node={simulationTree} />
          </View>
        ) : (
          <View className="items-center justify-center mt-3xl gap-md opacity-80">
            <MaterialCommunityIcons
              name="chart-timeline-variant"
              size={48}
              color={colors["text-tertiary"]}
            />

            <Text
              variant="body"
              className="text-text-tertiary max-w-[250px] text-center"
            >
              Selecione uma linha acima e defina uma meta para simular o
              impactado nas fábricas.
            </Text>
          </View>
        )}
      </View>
    </ScrollScreenContainer>
  );
}

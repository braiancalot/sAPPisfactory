import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stack, useFocusEffect } from "expo-router";
import { ActivityIndicator, Keyboard, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

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

import { colors } from "@theme/colors";

function ClearButton({
  visible,
  onClear,
}: {
  visible: boolean;
  onClear: () => void;
}) {
  if (!visible) return null;

  return (
    <Pressable
      className="p-xs rounded-full active:bg-surface-4"
      onPress={onClear}
    >
      <MaterialIcons
        name="refresh"
        size={20}
        color={colors["text-secondary"]}
      />
    </Pressable>
  );
}

function Summary({
  summary,
}: {
  summary: { production: number; balance: number };
}) {
  return (
    <View className="flex-row justify-between px-xs -mt-md">
      <View className="flex-row gap-2xs items-baseline">
        <Text variant="caption" className="text-text-tertiary">
          Produção atual:
        </Text>
        <RateDisplay value={summary.production} colored={false} />
      </View>

      <View className="flex-row gap-2xs items-baseline">
        <Text variant="caption" className="text-text-tertiary">
          Saldo:
        </Text>
        <RateDisplay value={summary.balance} size="sm" />
      </View>
    </View>
  );
}

function ErrorBox({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <View className="bg-danger/10 p-sm rounded-md">
      <Text variant="caption" className="text-danger">
        {error}
      </Text>
    </View>
  );
}

function ProjectorForm({
  selectedProductionLine,
  onSelectLine,
  targetRateStr,
  onChangeTarget,
  onProject,
  canRunSimulation,
  isLoading,
  currentSummary,
  projectedDelta,
  isTargetValid,
  isTargetReached,
  error,
}: {
  selectedProductionLine: ProductionLine | null;
  onSelectLine: (line: ProductionLine | null) => void;
  targetRateStr: string;
  onChangeTarget: (v: string) => void;
  onProject: () => Promise<void> | void;
  canRunSimulation: boolean;
  isLoading: boolean;
  currentSummary: { production: number; balance: number } | null;
  projectedDelta: number;
  isTargetValid: boolean;
  isTargetReached: boolean;
  error: string | null;
}) {
  return (
    <Card className="p-md gap-lg mx-md mt-lg">
      <View>
        <ProductionLinePicker
          label="Linha de produção"
          selected={selectedProductionLine}
          onSelect={onSelectLine}
        />
      </View>

      {currentSummary && (
        <>
          <Summary summary={currentSummary} />

          <View>
            <Input
              label="Nova produção"
              placeholder={
                currentSummary
                  ? `Ex: ${Math.ceil(currentSummary.production * 1.5)}`
                  : "Ex: 20"
              }
              numeric
              value={targetRateStr}
              onChangeValue={onChangeTarget}
              onSubmit={onProject}
            />

            {isTargetValid && !isTargetReached && (
              <Text
                variant="caption"
                className="mt-xs ml-xs text-text-secondary"
              >
                Isso adiciona{" "}
                <Text variant="caption" className="text-success">
                  +{projectedDelta}/min
                </Text>{" "}
                à produção atual
              </Text>
            )}
          </View>
        </>
      )}

      <ErrorBox error={error} />

      <Button
        title={isLoading ? "Calculando..." : "Calcular impacto"}
        onPress={onProject}
        disabled={!canRunSimulation}
      />
    </Card>
  );
}

function SimulationPanel({
  isLoading,
  simulationTree,
}: {
  isLoading: boolean;
  simulationTree: SimulationNode | null;
}) {
  const hasProblemInTree = simulationTree
    ? hasDeficitInBranch(simulationTree)
    : false;

  const status =
    simulationTree?.requestedAmount === 0
      ? "META JÁ ATENDIDA"
      : hasProblemInTree
        ? "GARGALOS ENCONTRADOS"
        : "PRONTO PARA PRODUZIR";

  return (
    <View className="p-md mt-xl">
      {isLoading ? (
        <View className="items-center justify-center mt-3xl gap-md">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" className="text-text-secondary">
            Processando simulação
          </Text>
        </View>
      ) : simulationTree ? (
        <View>
          <View className="flex-row items-center justify-between mb-md">
            <Text variant="subhead" className="text-text-secondary uppercase">
              Relatório de impacto
            </Text>

            <View
              className={`px-sm py-2xs rounded-pill ${
                hasProblemInTree ? "bg-danger/20" : "bg-success/20"
              }`}
            >
              <Text
                variant="caption"
                className={hasProblemInTree ? "text-danger" : "text-success"}
              >
                {status}
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
            Selecione uma linha acima e defina uma meta para simular o impactado
            nas fábricas.
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ProjectorScreen() {
  const [selectedProductionLine, setSelectedProductionLine] =
    useState<ProductionLine | null>(null);
  const [targetRateStr, setTargetRateStr] = useState("");
  const [simulationTree, setSimulationTree] = useState<SimulationNode | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const { isTargetValid, isTargetReached } = useMemo(() => {
    if (!currentSummary || targetRateStr === "")
      return { isTargetValid: false, isTargetReached: false };

    const target = parsePtBrNumber(targetRateStr);

    return {
      isTargetValid: target > 0,
      isTargetReached: target <= currentSummary.production,
    };
  }, [currentSummary, targetRateStr]);

  const canRunSimulation = Boolean(
    selectedProductionLine && isTargetValid && !isLoading && !error
  );

  const runSimulation = useCallback(async () => {
    if (!canRunSimulation) return;

    setIsLoading(true);
    setError(null);

    try {
      const targetRate = parsePtBrNumber(targetRateStr);

      const productionLines = await productionLinesCollection.query().fetch();
      const productionLineInputs = await productionLineInputsCollection
        .query()
        .fetch();

      const context = createProjectorContext(
        productionLines,
        productionLineInputs,
        balances!
      );

      const tree = projectGoal(selectedProductionLine!.id, targetRate, context);
      setSimulationTree(tree);
    } catch (error) {
      setError("Não foi possível calcular o impacto. Tente novamente");
      setSimulationTree(null);
    } finally {
      setIsLoading(false);
    }
  }, [targetRateStr, balances]);

  const processRef = useRef(runSimulation);

  useEffect(() => {
    processRef.current = runSimulation;
  }, [runSimulation]);

  useFocusEffect(
    useCallback(() => {
      processRef.current();
    }, [])
  );

  function handleClear() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProductionLine(null);
    setTargetRateStr("");
    setSimulationTree(null);
    setError(null);
    Keyboard.dismiss();
  }

  function handleSelectLine(line: ProductionLine | null) {
    setSelectedProductionLine(line);
    setSimulationTree(null);
    setTargetRateStr("");
    setError(null);
  }

  function handleChangeTarget(value: string) {
    setTargetRateStr(value);
    setSimulationTree(null);
    setError(null);
  }

  async function handleProject() {
    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await runSimulation();
  }

  return (
    <ScrollScreenContainer>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ClearButton
              visible={Boolean(selectedProductionLine || targetRateStr)}
              onClear={handleClear}
            />
          ),
        }}
      />

      <ProjectorForm
        selectedProductionLine={selectedProductionLine}
        onSelectLine={handleSelectLine}
        targetRateStr={targetRateStr}
        onChangeTarget={handleChangeTarget}
        onProject={handleProject}
        canRunSimulation={canRunSimulation}
        isLoading={isLoading}
        currentSummary={currentSummary}
        projectedDelta={projectedDelta}
        isTargetValid={isTargetValid}
        isTargetReached={isTargetReached}
        error={error}
      />

      <SimulationPanel simulationTree={simulationTree} isLoading={isLoading} />
    </ScrollScreenContainer>
  );
}

function hasDeficitInBranch(node: SimulationNode): boolean {
  if (node.status === "DEFICIT" || node.status === "WARNING") return true;
  return node.children.some(hasDeficitInBranch);
}

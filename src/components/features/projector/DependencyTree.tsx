import { memo, useState } from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { getItemData } from "@data/item";
import { SimulationNode } from "@services/goal-projector/goalProjector.types";

import Card from "@ui/Card";
import Item from "@ui/Item";
import Text from "@ui/Text";
import RateDisplay from "@ui/RateDisplay";
import { colors } from "@theme/colors";
import PressableCard from "@ui/PressableCard";

type Props = {
  node: SimulationNode;
  level?: number;
  ancestors?: boolean[];
  isLast?: boolean;
};

const INDENT_SIZE = 32;
const HALF_INDENT = INDENT_SIZE / 2;

function hasDeficitInBranch(node: SimulationNode): boolean {
  if (node.status === "DEFICIT" || node.status === "WARNING") return true;
  return node.children.some(hasDeficitInBranch);
}

function formatCompact(number: number) {
  return Number(number.toFixed(2)).toString();
}

function DependencyTree({ node, level = 0, ancestors = [] }: Props) {
  const router = useRouter();
  const itemData = getItemData(node.itemId);
  const hasChildren = node.children.length > 0;

  const shouldStartExpanded = level === 0 || hasDeficitInBranch(node);
  const [expanded, setExpanded] = useState(shouldStartExpanded);

  const isProblem = node.status !== "OK";
  const containerStyle = isProblem ? "" : "opacity-60";

  const totalCapacity = Math.max(0, node.currentBalance);
  const displayDemand = node.requestedAmount;

  function toggleCollapse() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  }

  function handlePress() {
    Haptics.selectionAsync();

    if (node.sourceType === "PRODUCTION_LINE") {
      router.push(`/production-line/${node.productionLineId}`);
    } else if (node.sourceType === "GLOBAL_SOURCE") {
      router.push(`/global-sources`);
    }
  }

  function getSourceIcon() {
    switch (node.sourceType) {
      case "PRODUCTION_LINE":
        return "factory";
      case "GLOBAL_SOURCE":
        return "public";
      case "CYCLE":
        return "loop";
      case "UNLINKED":
        return "link-off";
    }
  }

  function getSourceIconColor() {
    if (node.status === "WARNING" || node.status === "CYCLE_DETECTED") {
      return colors.warning;
    }

    return colors["text-tertiary"];
  }

  function getSourceLabel() {
    switch (node.sourceType) {
      case "PRODUCTION_LINE":
        return "Linha de produção";
      case "GLOBAL_SOURCE":
        return "Fonte Global";
      case "CYCLE":
        return "Ciclo detectado";
      case "UNLINKED":
        return "Sem origem definida";
    }
  }

  function getSourceLabelColor() {
    if (node.status === "WARNING" || node.status === "CYCLE_DETECTED") {
      return "text-warning";
    }

    return "text-text-tertiary";
  }

  return (
    <>
      <View className="flex-row">
        {level > 0 && (
          <View style={{ width: level * INDENT_SIZE }} className="relative">
            {ancestors.map(
              (shouldDraw, index) =>
                shouldDraw && (
                  <View
                    key={index}
                    className="absolute top-[-8] bottom-[-8] w-[1px] bg-border"
                    style={{ left: index * INDENT_SIZE + HALF_INDENT }}
                  />
                )
            )}

            <View
              className="absolute top-[-8] w-[1px] bg-border"
              style={{
                left: (level - 1) * INDENT_SIZE + HALF_INDENT,
                height: 44,
              }}
            />

            <View
              className="absolute h-[1px] bg-border"
              style={{
                left: (level - 1) * INDENT_SIZE + HALF_INDENT,
                top: 36,
                width: HALF_INDENT,
              }}
            />

            {hasChildren && (
              <Pressable
                hitSlop={8}
                onPress={toggleCollapse}
                className="absolute bg-background"
                style={{
                  left: (level - 1) * INDENT_SIZE + HALF_INDENT - 8,
                  top: 28,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name={expanded ? "expand-more" : "chevron-right"}
                  size={16}
                  color={colors["text-tertiary"]}
                />
              </Pressable>
            )}
          </View>
        )}

        <PressableCard
          className={`flex-1 my-xs p-sm rounded-md ${containerStyle}`}
          backgroundColor={isProblem ? "bg-surface-2" : "bg-transparent"}
          activeBackgroundColor={isProblem ? "bg-surface-3" : "bg-surface-1"}
          onPress={handlePress}
        >
          <View className="flex-row items-center justify-between gap-md">
            <View className="flex-row items-center gap-md flex-1">
              <Item icon={itemData.icon} size="sm" />

              <View className="flex-1 gap-2xs">
                <View className="flex-row items-center justify-between">
                  <Text
                    variant="body"
                    className={
                      isProblem
                        ? "text-text-primary font-bold"
                        : "text-text-secondary"
                    }
                    numberOfLines={1}
                  >
                    {itemData.name}
                  </Text>
                </View>

                <View className="flex-row items-center gap-xs">
                  <MaterialIcons
                    name={getSourceIcon()}
                    size={10}
                    color={getSourceIconColor()}
                  />
                  <Text variant="caption" className={getSourceLabelColor()}>
                    {getSourceLabel()}
                  </Text>
                </View>
              </View>
            </View>

            <View className="items-end justify-center">
              <RateDisplay
                value={node.projectedBalance}
                size="sm"
                colored={true}
              />
              <Text
                variant="numberXs"
                className="text-text-tertiary opacity-80 mt-[-2]"
              >
                {formatCompact(displayDemand)}/{formatCompact(totalCapacity)}
              </Text>
            </View>
          </View>
        </PressableCard>
      </View>

      {expanded &&
        hasChildren &&
        node.children.map((child, index) => (
          <DependencyTree
            key={child.id}
            node={child}
            level={level + 1}
            ancestors={[...ancestors, index < node.children.length - 1]}
          />
        ))}
    </>
  );
}

export default memo(DependencyTree);

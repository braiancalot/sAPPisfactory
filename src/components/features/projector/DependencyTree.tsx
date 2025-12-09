import { Pressable, View } from "react-native";

import { getItemData } from "@data/item";
import { SimulationNode } from "@services/goal-projector/goalProjector.types";

import Card from "@ui/Card";
import Item from "@ui/Item";
import Text from "@ui/Text";
import RateDisplay from "@ui/RateDisplay";
import { memo, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import PressableCard from "@ui/PressableCard";
import { useRouter } from "expo-router";

type Props = {
  node: SimulationNode;
  level?: number;
  ancestors?: boolean[];
  isLast?: boolean;
};

const INDENT_SIZE = 32;
const HALF_INDENT = INDENT_SIZE / 2;

function DependencyTree({ node, level = 0, ancestors = [] }: Props) {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const hasChildren = node.children.length > 0;

  const itemData = getItemData(node.itemId);

  function handlePress() {
    if (node.sourceType === "PRODUCTION_LINE") {
      router.push(`/production-line/${node.productionLineId}`);
    } else if (node.sourceType === "GLOBAL_SOURCE") {
      router.push(`/global-sources`);
    }
  }

  function getBorderColor() {
    // if (node.status === "DEFICIT") return "border-danger/60";
    // if (node.status === "WARNING" || node.status === "CYCLE_DETECTED")
    //   return "border-warning/60";
    return "border-transparent";
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

            {/* {hasChildren ? (
              <Pressable
                hitSlop={8}
                onPress={() => setExpanded(!expanded)}
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
            ) : (
              <View
                className="absolute h-[1px] bg-border"
                style={{
                  left: (level - 1) * INDENT_SIZE + HALF_INDENT,
                  top: 36,
                  width: HALF_INDENT,
                }}
              />
            )} */}

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
                onPress={() => setExpanded(!expanded)}
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
          className={`flex-1 my-xs p-sm rounded-md border ${getBorderColor()}`}
          backgroundColor="bg-surface-1"
          activeBackgroundColor="bg-surface-2"
          onPress={handlePress}
        >
          <View className="flex-row items-center justify-between gap-xl">
            <View className="flex-row items-center gap-lg flex-1">
              <Item icon={itemData.icon} size="md" />

              <View className="flex-1 gap-2xs">
                <Text variant="body" className="text-text-primary">
                  {itemData.name}
                </Text>

                <View className="flex-row items-center gap-xs">
                  <MaterialIcons
                    name={getSourceIcon()}
                    size={12}
                    color={getSourceIconColor()}
                  />
                  <Text variant="caption" className={getSourceLabelColor()}>
                    {getSourceLabel()}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <RateDisplay
                value={node.projectedBalance}
                size="sm"
                colored={node.status === "DEFICIT"}
              />
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

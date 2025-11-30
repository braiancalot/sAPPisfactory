import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { of, switchMap } from "@nozbe/watermelondb/utils/rx";

import ProductionLineInput from "@db/model/ProductionLineInput";
import GlobalSource from "@db/model/GlobalSource";
import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";
import { getItemData } from "@data/item";

import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";
import PressableCard from "@ui/PressableCard";
import { SourceType } from "@features/production-line/AssociateInputSourceSheet";
import { colors } from "@theme/colors";
import { MaterialIcons } from "@expo/vector-icons";

type ExternalProps = {
  input: ProductionLineInput;
  onPress: (input: ProductionLineInput) => void;
  onAction: (input: ProductionLineInput) => void;
};

type Props = ExternalProps & {
  globalSource?: GlobalSource | null;
  sourceProductionLine?: ProductionLine | null;
  factory?: Factory | null;
};

function InputRow({
  input,
  globalSource,
  sourceProductionLine,
  factory,
  onPress,
  onAction,
}: Props) {
  const itemData = getItemData(input.inputItem);

  const { sourceName, hasSource, isGlobal } = useMemo(() => {
    if (input.sourceType === SourceType.GLOBAL_SOURCE && globalSource) {
      return {
        sourceName: "Fonte Global",
        hasSource: true,
        isGlobal: true,
      };
    }

    if (
      input.sourceType === SourceType.PRODUCTION_LINE &&
      sourceProductionLine
    ) {
      return {
        sourceName: factory?.name ?? "Linha de Produção",
        hasSource: true,
        isGlobal: false,
      };
    }

    return {
      sourceName: "Sem origem definida",
      hasSource: false,
      isGlobal: false,
    };
  }, [input, globalSource, sourceProductionLine, factory]);

  return (
    <PressableCard
      className={`flex-row items-center justify-between p-sm gap-xl rounded-md border ${!hasSource ? "border-warning/60" : "border-transparent"}`}
      onPress={() => onPress(input)}
    >
      <View className="flex-row items-center gap-lg flex-1">
        <Item icon={itemData.icon} size="md" />

        <View className="flex-1 gap-2xs">
          <Text
            variant="body"
            className="text-text-primary flex-wrap"
            numberOfLines={1}
          >
            {itemData.name}
          </Text>

          <View className="flex-row items-center gap-xs">
            <MaterialIcons
              name={
                hasSource ? (isGlobal ? "public" : "factory") : "error-outline"
              }
              size={12}
              color={hasSource ? colors["text-tertiary"] : colors.warning}
            />

            <Text
              variant="caption"
              className={hasSource ? "text-text-tertiary" : "text-warning"}
              numberOfLines={1}
            >
              {sourceName}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-md">
        <RateDisplay value={-input.inputBaseRate} size="sm" colored={false} />

        <Pressable
          onPress={() => onAction(input)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            hasSource
              ? "bg-secondary/10 active:bg-secondary/30"
              : "bg-warning/10 active:bg-warning/30"
          }`}
        >
          <MaterialIcons
            name={hasSource ? "arrow-forward" : "link-off"}
            size={18}
            color={hasSource ? colors.secondary : colors.warning}
          />
        </Pressable>
      </View>
    </PressableCard>
  );
}

const enhance = withObservables(["input"], ({ input }: ExternalProps) => ({
  input,
  globalSource: input.globalSource,
  sourceProductionLine: input.sourceProductionLine,
  factory: input.sourceProductionLine
    .observe()
    .pipe(switchMap((line) => (line ? line.factory.observe() : of(null)))),
}));

export default enhance(InputRow) as React.ComponentType<ExternalProps>;

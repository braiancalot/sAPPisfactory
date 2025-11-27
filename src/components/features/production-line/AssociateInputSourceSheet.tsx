import { forwardRef, useMemo, RefObject } from "react";
import { Pressable, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";

import { globalSourcesCollection, productionLinesCollection } from "@db/index";
import ProductionLineInput from "@db/model/ProductionLineInput";
import GlobalSource from "@db/model/GlobalSource";
import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";
import { getItemData } from "@data/item";

import { useBottomSheetBackHandler } from "@hooks/useBottomSheetBackHandler";

import Text from "@ui/Text";
import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";

import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

export const SourceType = {
  GLOBAL_SOURCE: "GLOBAL_SOURCE",
  PRODUCTION_LINE: "PRODUCTION_LINE",
} as const;

export type SourceType = keyof typeof SourceType;

type ExternalProps = {
  input: ProductionLineInput | null | undefined;
  excludedLineId?: string;
  onSelect: (id: string, type: SourceType) => void;
  onCancel: () => void;
};

type Props = ExternalProps & {
  globalSources: GlobalSource[];
  productionLines: ProductionLine[];
  sheetRef?: React.ForwardedRef<BottomSheetModal>;
};

function AssociateInputSourceSheet({
  input,
  globalSources,
  productionLines,
  onSelect,
  onCancel,
  sheetRef,
}: Props) {
  const { handleSheetChanges } = useBottomSheetBackHandler(
    sheetRef as RefObject<BottomSheetModal>
  );

  const currentSelectionId = getCurrentSelectionId();

  function getCurrentSelectionId() {
    if (input?.sourceType === SourceType.GLOBAL_SOURCE) {
      return input?.globalSource.id;
    }

    if (input?.sourceType === SourceType.PRODUCTION_LINE) {
      return input?.sourceProductionLine.id;
    }

    return null;
  }

  function handleDismiss() {
    onCancel();
  }

  const SectionHeader = ({ title }: { title: string }) => (
    <View className="mt-lg mb-xs px-xs">
      <Text variant="caption" className="text-text-tertiary uppercase">
        {title}
      </Text>
    </View>
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={["50%", "90%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors["surface-2"] }}
      handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
      onDismiss={handleDismiss}
      onChange={handleSheetChanges}
    >
      <View className="px-lg pb-md border-b border-border">
        <Text variant="title" className="text-text-primary">
          Selecione a origem
        </Text>
      </View>

      <BottomSheetScrollView contentContainerClassName="px-md pb-xl gap-xs">
        {globalSources.length === 0 && productionLines.length === 0 && (
          <View className="items-center justify-center py-xl">
            <Text variant="body" className="text-text-secondary">
              Nenhuma fonte encontrada.
            </Text>
          </View>
        )}

        {globalSources.length > 0 && (
          <View>
            <SectionHeader title="Fontes Globais" />

            <View className="gap-xs">
              {globalSources.map((item) => (
                <EnhancedSourceRow
                  key={item.id}
                  model={item}
                  type={SourceType.GLOBAL_SOURCE}
                  isSelected={item.id === currentSelectionId}
                  onPress={() => onSelect(item.id, SourceType.GLOBAL_SOURCE)}
                />
              ))}
            </View>
          </View>
        )}

        {productionLines.length > 0 && (
          <View>
            <SectionHeader title="Linhas de produção" />

            <View className="gap-xs">
              {productionLines.map((item) => (
                <EnhancedSourceRow
                  key={item.id}
                  model={item}
                  type={SourceType.PRODUCTION_LINE}
                  isSelected={item.id === currentSelectionId}
                  onPress={() => onSelect(item.id, SourceType.PRODUCTION_LINE)}
                />
              ))}
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );
}

const EnhancedComponent = withObservables(
  ["input", "excludedLineId"],
  ({ input, excludedLineId }: ExternalProps) => {
    if (!input) {
      return {
        globalSources: globalSourcesCollection.query(Q.where("id", "null")),
        productionLines: productionLinesCollection.query(Q.where("id", "null")),
      };
    }

    return {
      //   input: input,
      globalSources: globalSourcesCollection.query(
        Q.where("item", input.inputItem)
      ),
      productionLines: productionLinesCollection.query(
        Q.and(
          Q.where("output_item", input.inputItem),
          ...(excludedLineId ? [Q.where("id", Q.notEq(excludedLineId))] : [])
        )
      ),
    };
  }
)(AssociateInputSourceSheet);

export default forwardRef<BottomSheetModal, ExternalProps>((props, ref) => (
  <EnhancedComponent {...props} sheetRef={ref} />
));

type SourceRowProps = {
  model: GlobalSource | ProductionLine;
  type: SourceType;
  isSelected: boolean;
  onPress: () => void;
  factory?: Factory;
};

function SourceRow({
  model,
  type,
  isSelected,
  onPress,
  factory,
}: SourceRowProps) {
  let name = "Fonte Desconhecida";
  let rate = 0;

  if (type === SourceType.GLOBAL_SOURCE) {
    name = "Fonte Global";
    rate = (model as GlobalSource).totalRatePerMin;
  } else if (type === SourceType.PRODUCTION_LINE) {
    name = factory?.name || "Carregando fábrica...";
    rate = (model as ProductionLine).outputBaseRate;
  }

  const itemId =
    type === SourceType.GLOBAL_SOURCE
      ? (model as GlobalSource).item
      : (model as ProductionLine).outputItem;

  const itemData = getItemData(itemId);

  return (
    <Pressable
      className={`p-sm rounded-md flex-row items-center justify-between ${
        isSelected
          ? "bg-surface-3 border border-primary"
          : "bg-surface-1 active:bg-surface-3 border border-transparent"
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-md flex-1">
        <Item icon={itemData.icon} size="md" />

        <View>
          <Text
            variant="body"
            className={`${isSelected ? "text-text-primary" : "text-text-secondary"}`}
            numberOfLines={1}
          >
            {name}
          </Text>

          {type === SourceType.PRODUCTION_LINE && (
            <Text variant="caption" className="text-text-tertiary">
              Linha de Produção
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center gap-md">
        <RateDisplay value={rate} size="sm" />

        {isSelected && (
          <View className="w-5 h-5 bg-primary rounded-full items-center justify-center">
            <MaterialIcons
              name="check"
              size={14}
              color={colors["text-on-primary"]}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const EnhancedSourceRow = withObservables(
  ["model"],
  ({ model, type }: SourceRowProps) => {
    if (type === SourceType.PRODUCTION_LINE) {
      return {
        model,
        factory: (model as ProductionLine).factory,
      };
    }
    return { model };
  }
)(SourceRow);

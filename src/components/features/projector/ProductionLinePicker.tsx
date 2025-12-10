import { useRef } from "react";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { withObservables } from "@nozbe/watermelondb/react";

import { productionLinesCollection } from "@db/index";

import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";

import { getItemData } from "@data/item";

import { useBottomSheetBackHandler } from "@hooks/useBottomSheetBackHandler";
import { useGlobalBalance } from "@hooks/useGlobalBalance";

import { ProductionLineBalance } from "@services/global-balance/globalBalance.types";

import Text from "@ui/Text";
import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type ExternalProps = {
  label?: string;
  selected: ProductionLine | null;
  onSelect: (productionLine: ProductionLine) => void;
  placeholder?: string;
};

type Props = ExternalProps & {
  productionLines: ProductionLine[];
};

function ProductionLinePicker({
  label,
  selected,
  productionLines,
  onSelect,
  placeholder = "Selecione uma linha de produção",
}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { handleSheetChanges } = useBottomSheetBackHandler(bottomSheetRef);
  const { getProductionLineBalance } = useGlobalBalance();

  const selectedItemData = selected ? getItemData(selected.outputItem) : null;

  function handleOpen() {
    bottomSheetRef.current?.present();
  }

  function handleSelect(productionLine: ProductionLine) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(productionLine);
    bottomSheetRef.current?.close();
  }

  return (
    <View className="gap-xs">
      {label && (
        <Text variant="body" className="text-text-secondary">
          {label}
        </Text>
      )}

      <Pressable
        className="bg-field rounded-md px-md py-sm text-text-primary text-body border border-border flex-row justify-between items-center gap-md active:scale-99"
        onPress={handleOpen}
      >
        {selectedItemData ? (
          <View className="flex-row items-center gap-sm">
            <Item icon={selectedItemData.icon} size="sm" />
            <Text variant="body" className="text-text-primary">
              {selectedItemData.name}
            </Text>
          </View>
        ) : (
          <Text variant="body" className="text-text-tertiary">
            {placeholder}
          </Text>
        )}

        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={colors["text-secondary"]}
        />
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={["50%", "90%"]}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors["surface-2"] }}
        handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
        onChange={handleSheetChanges}
      >
        <View className="px-lg pb-md border-b border-border">
          <Text variant="title" className="text-text-primary">
            Selecione uma linha de produção
          </Text>
        </View>

        <BottomSheetScrollView contentContainerClassName="px-md pb-xl gap-xs">
          {productionLines.length === 0 ? (
            <View className="items-center justify-center py-2xl gap-sm opacity-50">
              <MaterialCommunityIcons
                name="database-off"
                size={32}
                color={colors["text-tertiary"]}
              />
              <Text variant="body" className="text-text-secondary text-center">
                Nenhuma linha de produção encontrada.
              </Text>
            </View>
          ) : (
            <View className="mt-lg gap-xs">
              {productionLines.map((item) => {
                const balance = getProductionLineBalance(item.id);

                return (
                  <EnhancedRow
                    key={item.id}
                    productionLine={item}
                    balance={balance}
                    isSelected={item.id === selected?.id}
                    onPress={() => handleSelect(item)}
                  />
                );
              })}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
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

const enhance = withObservables([], () => ({
  productionLines: productionLinesCollection.query(),
}));

export default enhance(
  ProductionLinePicker
) as React.ComponentType<ExternalProps>;

type RowProps = {
  productionLine: ProductionLine;
  balance: ProductionLineBalance | undefined;
  isSelected: boolean;
  onPress: () => void;
  factory?: Factory;
};

function Row({
  productionLine,
  balance,
  isSelected,
  onPress,
  factory,
}: RowProps) {
  const itemData = getItemData(productionLine.outputItem);

  return (
    <Pressable
      className={`p-sm rounded-md flex-row items-center justify-between ${
        isSelected
          ? "bg-surface-1 border border-primary"
          : "bg-surface-1 active:bg-surface-3 border border-transparent"
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-lg flex-1 mr-md">
        <Item icon={itemData.icon} size="md" />

        <View className="flex-1 gap-2xs">
          <Text
            variant="body"
            className={`${isSelected ? "text-text-primary font-medium" : "text-text-secondary"}`}
            numberOfLines={1}
          >
            {itemData.name}
          </Text>

          <View className="flex-row items-center gap-xs">
            <MaterialIcons
              name={"factory"}
              size={12}
              color={colors["text-tertiary"]}
            />

            <Text
              variant="caption"
              className="text-text-tertiary"
              numberOfLines={1}
            >
              {factory?.name ?? "Fábrica sem nome"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-md">
        <RateDisplay value={balance?.balance ?? 0} size="sm" />

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

const EnhancedRow = withObservables(
  ["productionLine"],
  ({ productionLine }: RowProps) => ({
    productionLine,
    factory: productionLine.factory,
  })
)(Row) as React.ComponentType<RowProps>;

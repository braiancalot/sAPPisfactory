import { useCallback } from "react";
import { View, FlatList } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import { getItemData } from "@data/item";

import { LineTotalRates } from "@services/global-balance/globalBalance.types";
import { useGlobalBalance } from "@hooks/useGlobalBalance";
import { formatPtBrNumber } from "src/utils/numberFormat";

import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";

type ExternalProps = {
  productionLine: ProductionLine;
  rates?: LineTotalRates["inputs"];
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

function InputConsumptionList({ inputs, rates }: Props) {
  const { getProductionLineBalance, getGlobalSourceBalance } =
    useGlobalBalance();

  const renderItem = useCallback(
    ({ item }: { item: ProductionLineInput }) => {
      const itemData = getItemData(item.inputItem);
      const rate = rates?.find((i) => i.inputItem === item.inputItem);
      const displayRate = rate?.totalInputRate ?? 0;

      const balance =
        item.sourceType === "GLOBAL_SOURCE"
          ? getGlobalSourceBalance(item.globalSource.id)
          : getProductionLineBalance(item.sourceProductionLine.id);

      const balanceValue = balance?.balance;

      let badgeColor = "bg-surface-3";
      let badgeTextColor = "text-text-tertiary";

      if ((balanceValue ?? 0) > 0) {
        badgeColor = "bg-success/10";
        badgeTextColor = "text-success-dark";
      } else if ((balanceValue ?? 0) < 0) {
        badgeColor = "bg-danger/10";
        badgeTextColor = "text-danger-dark";
      }

      return (
        <View className="flex-row items-center justify-between gap-md">
          <Item icon={itemData.icon} size="sm" />
          <View className="flex-row flex-1 gap-xs items-baseline">
            <Text
              variant="footnote"
              className="text-text-tertiary"
              numberOfLines={1}
            >
              {itemData.name}
            </Text>

            {balanceValue != null && (
              <View className={`px-[6] py-[2] rounded-sm ${badgeColor}`}>
                <Text variant="caption" className={badgeTextColor}>
                  {balanceValue > 0 ? "+" : ""}
                  {formatPtBrNumber(balanceValue)}
                </Text>
              </View>
            )}
          </View>

          <RateDisplay value={-displayRate} size="sm" colored={false} />
        </View>
      );
    },
    [rates]
  );

  return (
    <FlatList
      data={inputs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="border border-surface-2 rounded-md p-sm gap-sm mt-xs"
      ListEmptyComponent={ListEmptyComponent}
      scrollEnabled={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
}

function ListEmptyComponent() {
  return (
    <View className="items-center justify-center opacity-50">
      <Text variant="caption" className="text-text-tertiary">
        Nenhum ingrediente configurado
      </Text>
    </View>
  );
}

const enhance = withObservables(
  ["productionLine"],
  ({ productionLine }: ExternalProps) => ({
    inputs: productionLine.inputs,
  })
);

export default enhance(
  InputConsumptionList
) as React.ComponentType<ExternalProps>;

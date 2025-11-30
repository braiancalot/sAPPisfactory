import { getItemData } from "@data/item";
import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import { withObservables } from "@nozbe/watermelondb/react";
import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";
import { View, FlatList } from "react-native";

type ExternalProps = {
  productionLine: ProductionLine;
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

function InputConsumptionList({ inputs }: Props) {
  return (
    <FlatList
      data={inputs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const itemData = getItemData(item.inputItem);
        return (
          <View className="flex-row items-center justify-between gap-md">
            <Item icon={itemData.icon} size="sm" />
            <Text
              variant="footnote"
              className="text-text-secondary flex-1"
              numberOfLines={1}
            >
              {itemData.name}
            </Text>

            <RateDisplay
              value={-item.inputBaseRate}
              size="sm"
              colored={false}
            />
          </View>
        );
      }}
      contentContainerClassName="bg-surface-2 rounded-md p-sm gap-sm mt-xs"
      ListEmptyComponent={() => (
        <View className="items-center justify-center opacity-50">
          <Text variant="caption" className="text-text-tertiary">
            Nenhum ingrediente configurado
          </Text>
        </View>
      )}
      scrollEnabled={false}
    />
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

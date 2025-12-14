import { View } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import { getItemData } from "@data/item";

import { ProductionLineBalance } from "@services/global-balance/globalBalance.types";

import RateDisplay from "@ui/RateDisplay";
import Item from "@ui/Item";
import Text from "@ui/Text";
import SwipeableCard from "@ui/SwipeableCard";

type Props = {
  productionLine: ProductionLine;
  balance: ProductionLineBalance | undefined;
  onNavigate: (productionLine: ProductionLine) => void;
  onDelete: (productionLine: ProductionLine) => void;
};

function ProductionLineCard({
  productionLine,
  balance,
  onNavigate,
  onDelete,
}: Props) {
  const itemData = getItemData(productionLine.outputItem);

  function handlePress() {
    onNavigate(productionLine);
  }

  function handleDelete() {
    onDelete(productionLine);
  }

  return (
    <SwipeableCard
      onPress={handlePress}
      onDelete={handleDelete}
      shouldResetOnAction
      className="p-md rounded-lg"
    >
      <View className="flex-row items-center justify-between gap-md">
        <View className="flex-row items-center gap-lg flex-1">
          <Item icon={itemData.icon} size="md" />

          <View className="gap-2xs items-start flex-1">
            <Text
              variant="subhead"
              className="text-text-primary flex-wrap"
              numberOfLines={2}
            >
              {itemData.name}
            </Text>

            <View className="h-[19]">
              <RateDisplay
                value={balance?.production ?? 0}
                size="sm"
                colored={false}
              />
            </View>
          </View>
        </View>

        <View className="max-w-40">
          <RateDisplay value={balance?.balance ?? 0} size="md" />
        </View>
      </View>
    </SwipeableCard>
  );
}

const enhance = withObservables(["productionLine"], ({ productionLine }) => ({
  productionLine: productionLine,
}));

export default enhance(ProductionLineCard) as React.ComponentType<Props>;

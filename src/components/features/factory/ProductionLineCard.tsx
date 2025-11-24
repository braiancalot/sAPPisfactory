import { withObservables } from "@nozbe/watermelondb/react";

import Animated, {
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";

import ProductionLine from "@db/model/ProductionLine";
import { getItemData } from "@data/item";

import PressableCard from "@ui/PressableCard";
import RateDisplay from "@ui/RateDisplay";
import Item from "@ui/Item";
import Text from "@ui/Text";

import { View } from "react-native";

type Props = {
  productionLine: ProductionLine;
  onNavigate: (productionLine: ProductionLine) => void;
  onDelete: (productionLine: ProductionLine) => void;
};

function ProductionLineCard({ productionLine, onNavigate, onDelete }: Props) {
  const itemData = getItemData(productionLine.outputItem);

  function handlePress() {
    onNavigate(productionLine);
  }

  function handleDelete() {
    onDelete(productionLine);
  }

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
    >
      <PressableCard onPress={handlePress} onLongPress={handleDelete}>
        <View className="flex-row items-baseline justify-between gap-md">
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
                  value={productionLine.outputBaseRate}
                  size="sm"
                  colored={false}
                />
              </View>
            </View>
          </View>

          <View className="max-w-40">
            <RateDisplay value={productionLine.outputBaseRate} size="md" />
          </View>
        </View>
      </PressableCard>
    </Animated.View>
  );
}

const enhance = withObservables(["productionLine"], ({ productionLine }) => ({
  productionLine: productionLine,
}));

export default enhance(ProductionLineCard) as React.ComponentType<Props>;

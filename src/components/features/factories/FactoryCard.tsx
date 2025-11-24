import { withObservables } from "@nozbe/watermelondb/react";

import Animated, {
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";

import Factory from "@db/model/Factory";
import ProductionLine from "@db/model/ProductionLine";

import PressableCard from "@ui/PressableCard";
import Text from "@ui/Text";
import Item from "@ui/Item";

import { View } from "react-native";
import { getItemData } from "@data/item";

type ExternalProps = {
  factory: Factory;
  onNavigate: (factory: Factory) => void;
  onDelete: (factory: Factory) => void;
};

type Props = ExternalProps & {
  productionLines: ProductionLine[];
};

function FactoryCard({
  factory,
  productionLines,
  onNavigate,
  onDelete,
}: Props) {
  function handlePress() {
    onNavigate(factory);
  }

  function handleDelete() {
    onDelete(factory);
  }

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
    >
      <PressableCard onPress={handlePress} onLongPress={handleDelete}>
        <View className="flex-row items-end justify-between gap-md">
          <View className="flex-1">
            <Text
              variant="subhead"
              className="text-text-primary flex-wrap"
              numberOfLines={1}
            >
              {factory.name}
            </Text>
          </View>

          <View className="flex-row gap-xs">
            {productionLines.map((productionLine) => (
              <Item
                key={productionLine.id}
                icon={getItemData(productionLine.outputItem).icon}
                size="sm"
              />
            ))}
          </View>
        </View>
      </PressableCard>
    </Animated.View>
  );
}

const enhance = withObservables(["factory"], ({ factory }) => ({
  factory: factory,
  productionLines: factory.productionLines,
}));

export default enhance(FactoryCard) as React.ComponentType<ExternalProps>;

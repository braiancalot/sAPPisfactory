import { View } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLineInput from "@db/model/ProductionLineInput";
import { getItemData } from "@data/item";

import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";
import PressableCard from "@ui/PressableCard";
import Animated, {
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";

type Props = {
  input: ProductionLineInput;
  onPress: (input: ProductionLineInput) => void;
};

function InputRow({ input, onPress }: Props) {
  const itemData = getItemData(input.inputItem);

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
    >
      <PressableCard
        className="p-sm bg-surface-2 active:bg-surface-3 rounded-md"
        onPress={() => onPress(input)}
      >
        <View className="flex-row items-center justify-between gap-md">
          <View className="flex-row items-center gap-lg flex-1">
            <Item icon={itemData.icon} size="md" />

            <Text
              variant="body"
              className="text-text-secondary flex-wrap flex-1"
              numberOfLines={1}
            >
              {itemData.name}
            </Text>
          </View>

          <RateDisplay value={-input.inputBaseRate} size="sm" colored={false} />
        </View>
      </PressableCard>
    </Animated.View>
  );
}

const enhance = withObservables(["input"], ({ input }) => ({
  input,
}));

export default enhance(InputRow) as React.ComponentType<Props>;

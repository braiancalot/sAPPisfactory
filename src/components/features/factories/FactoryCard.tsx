import Animated, {
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";

import Factory from "@db/model/Factory";

import PressableCard from "@ui/PressableCard";
import Text from "@ui/Text";

import { View } from "react-native";

type Props = {
  factory: Factory;
  onNavigate: (factory: Factory) => void;
  onDelete: (factory: Factory) => void;
};

export default function FactoryCard({ factory, onNavigate, onDelete }: Props) {
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
        <View className="flex-row items-baseline justify-between gap-md">
          <View className="flex-row items-center gap-lg flex-1">
            <View className="gap-2xs items-start flex-1">
              <Text
                variant="subhead"
                className="text-text-primary flex-wrap"
                numberOfLines={2}
              >
                {factory.name}
              </Text>
            </View>
          </View>
        </View>
      </PressableCard>
    </Animated.View>
  );
}

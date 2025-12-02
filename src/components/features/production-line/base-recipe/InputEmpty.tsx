import Animated, { FadeIn } from "react-native-reanimated";

import Text from "@ui/Text";

export default function InputEmpty() {
  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(200)}
      className="p-md items-center justify-center border border-dashed border-border rounded-md opacity-50 h-[61]"
    >
      <Text variant="caption" className="text-text-tertiary">
        Nenhum ingrediente configurado
      </Text>
    </Animated.View>
  );
}

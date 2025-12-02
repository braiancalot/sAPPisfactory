import Animated, { FadeIn } from "react-native-reanimated";
import Text from "@ui/Text";

export default function ScaleGroupEmpty() {
  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(200)}
      className="p-md items-center justify-center border border-dashed border-border rounded-md opacity-50 h-[56]"
    >
      <Text variant="caption" className="text-text-tertiary">
        Nenhum módulo configurado
      </Text>
    </Animated.View>
  );
}

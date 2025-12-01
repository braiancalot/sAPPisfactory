import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Text from "@ui/Text";

import { colors } from "@theme/colors";

export default function FactoryListEmpty() {
  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(200)}
      className="items-center justify-center py-xl"
    >
      <MaterialCommunityIcons
        name="factory"
        size={48}
        color={colors["text-tertiary"]}
      />

      <Text variant="subhead" className="text-text-secondary mt-md">
        Nenhuma fábrica cadastrada
      </Text>

      <Text variant="body" className="text-text-tertiary mt-xs">
        Adicione sua primeira fábrica para organizar suas linhas de produção
      </Text>
    </Animated.View>
  );
}

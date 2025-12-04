import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import "../../../global.css";
import { colors } from "@theme/colors";

type Props = {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function FAB({ onPress, icon = "add" }: Props) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      className="absolute bottom-lg right-lg active:scale-95 bg-primary active:bg-primary-dark w-14 h-14 rounded-full items-center justify-center"
    >
      <MaterialIcons name={icon} size={28} color={colors["text-on-primary"]} />
    </Pressable>
  );
}

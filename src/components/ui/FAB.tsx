import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import "../../../global.css";
import { colors } from "@theme/colors";

type Props = {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function FAB({ onPress, icon = "add" }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-xl right-xl w-14 h-14 bg-accent active:bg-accent-dark rounded-full items-center justify-center"
    >
      <MaterialIcons name={icon} size={28} color={colors["text-primary"]} />
    </Pressable>
  );
}

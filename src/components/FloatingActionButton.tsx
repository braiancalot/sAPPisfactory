import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

type Props = {
  onPress: () => void;
};

export default function FloatingActionButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? theme.colors.accent.dark
            : theme.colors.accent.DEFAULT,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}
    >
      <MaterialIcons name="add" size={28} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.full,
    elevation: theme.elevations.fab,
  },
});

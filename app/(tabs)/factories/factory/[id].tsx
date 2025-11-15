import { View, StyleSheet } from "react-native";
import Text from "@ui/Text";

export default function FactoryScreen() {
  return (
    <View style={styles.container}>
      <Text variant="title">Factory Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

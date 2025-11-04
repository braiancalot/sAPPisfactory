import { StyleSheet, Text, View } from "react-native";

export default function FactoriesScreen() {
  return (
    <View style={styles.container}>
      <Text>Factories Screen</Text>
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

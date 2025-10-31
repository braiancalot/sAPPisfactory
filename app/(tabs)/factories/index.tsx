import { Link } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function FactoriesScreen() {
  return (
    <View style={styles.container}>
      <Text>Factories Screen</Text>

      <Link href="/factories/factory/1" asChild>
        <Button title="Ir para fábrica #1" />
      </Link>
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

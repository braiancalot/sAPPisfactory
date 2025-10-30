import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function FactoriesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Fábricas" }} />

      <Text>Factories Screen</Text>

      <Link href={"/factories/1"}>Fábrica 1</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

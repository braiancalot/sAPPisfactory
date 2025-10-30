import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function FactoryScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Fábrica 1" }} />

      <Text>Factory Screen</Text>

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

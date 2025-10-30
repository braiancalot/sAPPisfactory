import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import RawMaterialList from "../../src/components/RawMaterialList";

export default function RawMaterialScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: "Matéria Prima" }} />

      <RawMaterialList />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({});

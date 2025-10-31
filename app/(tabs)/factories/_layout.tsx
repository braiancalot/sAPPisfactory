import { Stack } from "expo-router";

export default function FactoriesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Fábricas" }} />

      <Stack.Screen name="factory/[id]" options={{ title: "Fábrica" }} />
    </Stack>
  );
}

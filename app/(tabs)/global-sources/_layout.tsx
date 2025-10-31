import { Stack } from "expo-router";

export default function GlobalSourcesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Fontes Globais" }} />
    </Stack>
  );
}

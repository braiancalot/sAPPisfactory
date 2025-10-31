import { Stack } from "expo-router";

export default function RawMaterialLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Matéria-prima" }} />
    </Stack>
  );
}

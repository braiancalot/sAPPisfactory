import { colors } from "@theme/colors";
import { Stack } from "expo-router";

export default function FactoriesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Fábricas",
          headerStyle: {
            backgroundColor: colors["surface-2"],
          },
          headerTintColor: colors["text-primary"],
          headerTitleStyle: {
            fontSize: 24,
          },
        }}
      />

      <Stack.Screen name="factory/[id]" options={{ title: "Fábrica" }} />
    </Stack>
  );
}

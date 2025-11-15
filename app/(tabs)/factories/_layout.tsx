import { colors } from "@theme/colors";
import { Stack } from "expo-router";
import { typography } from "src/utils/typography";

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
          headerTitleStyle: typography.headline,
        }}
      />

      <Stack.Screen name="factory/[id]" options={{ title: "Fábrica" }} />
    </Stack>
  );
}

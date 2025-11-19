import { colors } from "@theme/colors";
import { Stack } from "expo-router";
import { typography } from "src/utils/typography";

export default function FactoriesLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors["background"] },
        headerStyle: {
          backgroundColor: colors["surface-2"],
        },
        headerTintColor: colors["text-primary"],
        headerTitleStyle: typography.headline,
        animation: "ios_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Fábricas",
        }}
      />

      <Stack.Screen
        name="factory/[id]"
        options={{
          title: "Fábrica",
        }}
      />
    </Stack>
  );
}

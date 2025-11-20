import { Stack } from "expo-router";
import { colors } from "@theme/colors";
import { typography } from "src/utils/typography";

export default function TabLayout() {
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
        name="[id]"
        options={{
          title: "Fábrica",
        }}
      />
    </Stack>
  );
}

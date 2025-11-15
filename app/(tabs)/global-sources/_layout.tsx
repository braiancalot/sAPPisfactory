import { Stack } from "expo-router";
import { colors } from "@theme/colors";
import { typography } from "src/utils/typography";

export default function GlobalSourcesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Fontes Globais",
          headerStyle: {
            backgroundColor: colors["surface-2"],
          },
          headerTintColor: colors["text-primary"],
          headerTitleStyle: typography.headline,
        }}
      />
    </Stack>
  );
}

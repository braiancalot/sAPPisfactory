import { Stack } from "expo-router";
import { colors } from "@theme/colors";

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
          headerTitleStyle: {
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}

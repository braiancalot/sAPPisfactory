import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@theme/colors";
import { typography } from "src/utils/typography";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors["surface-1"],
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors["text-secondary"],
        sceneStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors["surface-2"] },
        headerTintColor: colors["text-primary"],
        headerTitleStyle: typography.headline,
      }}
    >
      <Tabs.Screen
        name="global-sources"
        options={{
          title: "Fontes Globais",
          tabBarLabel: () => null,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="layers" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Fábricas",
          tabBarLabel: () => null,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="factory" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

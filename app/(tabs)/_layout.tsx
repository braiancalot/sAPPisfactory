import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="factories"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors["surface-1"],
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors["text-secondary"],
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="global-sources"
        options={{
          tabBarLabel() {
            return null;
          },
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="layers" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="factories"
        options={{
          tabBarLabel() {
            return null;
          },
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="factory" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

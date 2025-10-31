import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="factories"
      screenOptions={{
        headerShown: false,
      }}
    >
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

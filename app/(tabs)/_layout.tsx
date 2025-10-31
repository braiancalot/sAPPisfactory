import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="raw-material"
        options={{
          headerShown: false,
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
          headerShown: false,
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

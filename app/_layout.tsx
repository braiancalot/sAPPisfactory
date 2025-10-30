import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RootLayout() {
  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen
        name="raw-material"
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
        name="index"
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

import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@theme/colors";
import { typography } from "src/utils/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors["surface-1"],
          borderTopWidth: 0,
          borderTopColor: colors.border,
          height: 60,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors["primary"],
        tabBarInactiveTintColor: colors["text-secondary"],
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
          fontWeight: 500,
        },
        sceneStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors["surface-2"] },
        headerTintColor: colors["text-primary"],
        headerTitleStyle: typography.headline,
        animation: "shift",
      }}
      backBehavior="history"
    >
      <Tabs.Screen
        name="global-sources"
        options={{
          title: "Fontes Globais",
          tabBarLabel: "Fontes",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="layers" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Fábricas",
          tabBarLabel: "Fábricas",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="factory" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="projector"
        options={{
          title: "Projetor de Metas",
          tabBarLabel: "Projetor",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          lazy: true,
          freezeOnBlur: true,
          tabBarLabel: "Mapa",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

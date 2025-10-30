import { FlatList, StyleSheet, View } from "react-native";
import RawMaterialListItem from "./RawMaterialListItem";

const raw_materials = [
  { name: "iron_ore", rate: 120 },
  { name: "copper_ore", rate: 180 },
  { name: "limestone", rate: 60 },
];

export default function RawMaterialList() {
  return (
    <FlatList
      data={raw_materials}
      contentContainerStyle={{ gap: 8, padding: 8 }}
      renderItem={({ item }) => (
        <RawMaterialListItem name={item.name} rate={item.rate} />
      )}
    />
  );
}

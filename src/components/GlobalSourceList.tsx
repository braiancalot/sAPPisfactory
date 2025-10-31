import { FlatList } from "react-native";
import GlobalSourceListItem from "./GlobalSourceListItem";

const sources = [
  { name: "iron_ore", rate: 120 },
  { name: "copper_ore", rate: 180 },
  { name: "limestone", rate: 60 },
];

export default function GlobalSourceList() {
  return (
    <FlatList
      data={sources}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }) => (
        <GlobalSourceListItem name={item.name} rate={item.rate} />
      )}
    />
  );
}

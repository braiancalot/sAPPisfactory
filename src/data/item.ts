import { getIconByItemId } from "../assets/iconMapper";
import { ImageSourcePropType } from "react-native";

export const ITEM_DATABASE = {
  iron_ore: {
    name: "Minério de ferro",
    icon: getIconByItemId("iron_ore"),
  },
  copper_ore: {
    name: "Minério de cobre",
    icon: getIconByItemId("copper_ore"),
  },
  limestone: {
    name: "Calcário",
    icon: getIconByItemId("limestone"),
  },
};

export type ItemId = keyof typeof ITEM_DATABASE;

export type Item = {
  id: ItemId;
  name: string;
  icon: ImageSourcePropType;
};

export const ITEM_LIST: Item[] = (
  Object.entries(ITEM_DATABASE) as [ItemId, Omit<Item, "id">][]
).map(([id, data]) => ({ id, ...data }));

export function getItemData(itemId: ItemId): Omit<Item, "id"> {
  return ITEM_DATABASE[itemId];
}

import { getIconByItemId } from "../assets/iconMapper";

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

export const ITEM_LIST = Object.keys(ITEM_DATABASE).map((itemId) => ({
  id: itemId,
  name: ITEM_DATABASE[itemId].name,
  icon: ITEM_DATABASE[itemId].icon,
}));

export function getItemData(itemId: string) {
  return ITEM_DATABASE[itemId];
}

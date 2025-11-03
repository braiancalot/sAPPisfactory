const icons = {
  iron_ore: require("./icons/iron_ore.png"),
  copper_ore: require("./icons/copper_ore.png"),
  limestone: require("./icons/limestone.png"),

  default: require("./icons/iron_ore.png"),
};

export function getIconByItemId(itemId: string) {
  return icons[itemId] || icons["default"];
}

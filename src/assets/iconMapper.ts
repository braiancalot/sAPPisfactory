const icons: { [key: string]: any } = {
  iron_ore: require("./icons/iron_ore.png"),
  copper_ore: require("./icons/copper_ore.png"),
  limestone: require("./icons/limestone.png"),

  iron_ingot: require("./icons/iron_ingot.png"),

  reinforced_iron_plate: require("./icons/reinforced_iron_plate.png"),
  modular_frame: require("./icons/modular_frame.png"),

  default: require("./icons/iron_ore.png"),
};

export function getIconByItemId(itemId: string) {
  return icons[itemId] || icons["default"];
}

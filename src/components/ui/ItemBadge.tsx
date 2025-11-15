import { View } from "react-native";
import { getItemData, ItemId } from "src/data/item";

import Item from "@ui/Item";
import Text from "@ui/Text";

const textVariants = {
  sm: "caption",
  md: "subhead",
  lg: "title",
};

type Size = keyof typeof textVariants;

type Props = {
  itemId: ItemId;
  size?: Size;
};

export default function ItemBadge({ itemId, size = "md" }: Props) {
  const itemData = getItemData(itemId);
  const textVariant = textVariants[size];

  return (
    <View className="flex-row items-center gap-sm">
      <Item icon={itemData.icon} size={size} />

      <Text variant={textVariant as any} className="text-text-primary">
        {itemData.name}
      </Text>
    </View>
  );
}

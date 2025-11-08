import { Text, View } from "react-native";
import { getItemData, ItemId } from "src/data/item";
import Item from "@ui/Item";

const variantStyles = {
  sm: {
    text: "text-caption",
  },
  md: {
    text: "text-subhead",
  },
  lg: {
    text: "text-title",
  },
};

type Props = {
  itemId: ItemId;
  size?: "sm" | "md" | "lg";
};

export default function ItemBadge({ itemId, size = "md" }: Props) {
  const itemData = getItemData(itemId);
  const styles = variantStyles[size];

  return (
    <View className="flex-row items-center gap-sm">
      <Item icon={itemData.icon} size={size} />

      <Text className={`text-text-primary ${styles.text}`}>
        {itemData.name}
      </Text>
    </View>
  );
}

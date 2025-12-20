import { Image } from "@ui/Image";
import Text from "@ui/Text";
import { Pressable, View } from "react-native";

type Props = {
  label: string;
  icon: any;
  count: number;
  total: number;
  isActive: boolean;
  onPress: () => void;
};

export default function FilterButton({
  label,
  icon,
  count,
  total,
  isActive,
  onPress,
}: Props) {
  const containerStyle = isActive
    ? "bg-surface-2 border-primary/80"
    : "bg-surface-1 active:bg-background border-border opacity-50";

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center px-xs py-2xs rounded-md gap-xs border ${containerStyle}`}
    >
      <Image source={icon} className="w-6 h-6" />

      <View className="flex-1">
        <Text variant="caption" className="text-text-tertiary">
          {label}
        </Text>
        <Text variant="caption" className="text-text-primary">
          {count}/{total}
        </Text>
      </View>
    </Pressable>
  );
}

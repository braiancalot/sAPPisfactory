import { View } from "react-native";
import { Image } from "@ui/Image";

const variantStyles = {
  sm: "w-[24] h-[24]",

  md: "w-[32] h-[32]",

  lg: "w-[48] h-[48]",
};

type Props = {
  icon: any;
  size: "sm" | "md" | "lg";
};

export default function Item({ icon, size }: Props) {
  const iconStyle = variantStyles[size];

  return (
    <View className="bg-surface p-xs rounded-sm border border-border">
      <Image source={icon} className={iconStyle} />
    </View>
  );
}

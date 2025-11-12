import { ImageSourcePropType } from "react-native";
import { Image } from "@ui/Image";

const variantStyles = {
  sm: "w-[16] h-[16]",
  md: "w-[32] h-[32]",
  lg: "w-[48] h-[48]",
};

type Props = {
  icon: ImageSourcePropType;
  size: "sm" | "md" | "lg";
};

export default function Item({ icon, size }: Props) {
  const iconStyle = variantStyles[size];

  return <Image source={icon} className={iconStyle} />;
}

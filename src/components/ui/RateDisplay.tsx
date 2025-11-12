import { Text, View } from "react-native";
import { formatPtBrNumber } from "src/utils/numberFormat";

const variantStyles = {
  sm: "text-number-sm",
  md: "text-number-md",
  lg: "text-number-lg",
};

function getColorClass(value: number) {
  if (value < 0) return "text-danger";
  if (value > 0) return "text-success";
  return "text-text-secondary";
}

type Props = {
  value: number;
  size?: "sm" | "md" | "lg";
  showUnit?: boolean;
  colored?: boolean;
};

export default function RateDisplay({
  value,
  size = "sm",
  showUnit = true,
  colored = true,
}: Props) {
  const style = variantStyles[size];
  const colorsClass = colored ? getColorClass(value) : "text-text-secondary";

  return (
    <View className="flex-row items-baseline gap-2xs">
      <Text className={`${style} ${colorsClass}`} numberOfLines={1}>
        {colored && value > 0 ? "+" : ""}
        {formatPtBrNumber(value)}
      </Text>
      {showUnit && (
        <Text className="text-text-tertiary text-caption">/min</Text>
      )}
    </View>
  );
}

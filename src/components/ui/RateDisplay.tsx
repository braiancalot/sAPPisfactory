import { Text, View } from "react-native";
import { formatPtBrNumber } from "src/utils/numberFormat";

const variantStyles = {
  sm: {
    value: "font-medium text-body",
  },
  md: {
    value: "font-bold text-title",
  },
  lg: {
    value: "font-bold text-headline",
  },
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
  const styles = variantStyles[size];
  const colorsClass = colored ? getColorClass(value) : "text-text-secondary";

  return (
    <View className="flex-row items-baseline gap-xs">
      <Text className={`${styles.value} ${colorsClass}`} numberOfLines={1}>
        {colored && value > 0 ? "+" : ""}
        {formatPtBrNumber(value)}
      </Text>
      {showUnit && (
        <Text className="text-text-secondary text-caption font-medium">
          /min
        </Text>
      )}
    </View>
  );
}

import { Text, View } from "react-native";
import { formatPtBrNumber } from "src/utils/numberFormat";

const variantStyles = {
  sm: {
    value: "text-body",
    unit: "text-caption",
  },
  md: {
    value: "text-title",
    unit: "text-body",
  },
  lg: {
    value: "text-[32px]",
    unit: "text-body",
  },
};

function getColorClass(value: number) {
  if (value < 0) return "text-danger";
  if (value > 0) return "text-success";
  return "text-warning";
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
  const colorsClass = colored ? getColorClass(value) : "text-text-primary";

  return (
    <View className="flex-row items-baseline gap-xs ">
      <Text className={`font-bold ${styles.value} ${colorsClass}`}>
        {formatPtBrNumber(value)}
      </Text>
      {showUnit && (
        <Text className={`text-text-secondary ${styles.unit}`}>/min</Text>
      )}
    </View>
  );
}

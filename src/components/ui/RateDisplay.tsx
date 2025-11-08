import { Text, View } from "react-native";
import { formatPtBrNumber } from "src/utils/numberFormat";

const variantStyles = {
  sm: {
    value: "text-title",
    unit: "text-caption",
  },
  md: {
    value: "text-headline",
    unit: "text-caption",
  },
  lg: {
    value: "text-[32px]",
    unit: "text-body",
  },
};

function getColorClass(value: number) {
  if (value < 0) return "text-danger";
  if (value > 0) return "text-success";
  return "text-text-primary";
}

type Props = {
  value: number;
  size?: "sm" | "md" | "lg";
  showUnit?: boolean;
};

export default function RateDisplay({ value, size = "sm" }: Props) {
  const styles = variantStyles[size];
  const colorsClass = getColorClass(value);

  return (
    <View className="flex-row items-baseline gap-xs ">
      <Text className={`font-bold ${styles.value} ${colorsClass}`}>
        {formatPtBrNumber(value)}
      </Text>
      <Text className={`text-text-secondary ${styles.unit}`}>/min</Text>
    </View>
  );
}

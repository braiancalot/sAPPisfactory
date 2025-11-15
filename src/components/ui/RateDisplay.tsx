import { StyleSheet, View } from "react-native";
import { formatPtBrNumber } from "src/utils/numberFormat";

import Text from "@ui/Text";

const textVariants = {
  sm: "numberSm",
  md: "numberMd",
  lg: "numberLg",
};

type Size = keyof typeof textVariants;

function getColorClass(value: number) {
  if (value < 0) return "text-danger";
  if (value > 0) return "text-success";
  return "text-text-secondary";
}

type Props = {
  value: number;
  size?: Size;
  showUnit?: boolean;
  colored?: boolean;
};

export default function RateDisplay({
  value,
  size = "sm",
  showUnit = true,
  colored = true,
}: Props) {
  const textVariant = textVariants[size];
  const colorsClass = colored ? getColorClass(value) : "text-text-secondary";

  return (
    <View className="flex-row items-baseline gap-2xs">
      <Text
        variant={textVariant as any}
        className={`${colorsClass}`}
        numberOfLines={1}
      >
        {colored && value > 0 ? "+" : ""}
        {formatPtBrNumber(value)}
      </Text>
      {showUnit && (
        <Text variant="caption" className="text-text-tertiary">
          /min
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "InterBold",
  },
});

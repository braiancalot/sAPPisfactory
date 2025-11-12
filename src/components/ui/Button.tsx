import { Pressable, Text } from "react-native";

const variantStyles = {
  primary: {
    container: "bg-primary active:bg-primary-dark",
    containerDisabled: "bg-primary-disabled",
    text: "text-text-on-primary",
    textDisabled: "text-text-on-primary",
  },
  secondary: {
    container: "bg-surface-4 active:bg-surface-3",
    containerDisabled: "bg-surface-4",
    text: "text-text-secondary",
    textDisabled: "text-text-secondary",
  },
  info: {
    container: "bg-secondary active:bg-secondary-dark",
    containerDisabled: "bg-secondary",
    text: "text-text-on-secondary",
    textDisabled: "text-text-on-secondary",
  },
  danger: {
    container: "bg-danger active:bg-danger-dark",
    containerDisabled: "bg-danger",
    text: "text-text-on-danger",
    textDisabled: "text-text-on-danger",
  },
  ghost: {
    container: "bg-transparent active:bg-background",
    containerDisabled: "bg-transparent",
    text: "text-primary",
    textDisabled: "text-primary",
  },
};

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "info" | "danger" | "ghost";
  fullWidth?: boolean;
};

export default function Button({
  onPress,
  title,
  disabled = false,
  variant = "primary",
  fullWidth = false,
}: Props) {
  const styles = variantStyles[variant];
  const widthStyle = fullWidth ? "flex-1" : "min-w-[120px]";

  const containerClass = disabled ? styles.containerDisabled : styles.container;
  const textClass = disabled ? styles.textDisabled : styles.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`px-lg py-sm rounded-md items-center justify-center active:scale-98 ${widthStyle} ${containerClass}`}
    >
      <Text
        className={`text-button ${textClass}`}
        style={{ fontFamily: "Inter_400Regular" }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

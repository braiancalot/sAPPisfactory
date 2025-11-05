import { Pressable, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export default function Button({
  onPress,
  title,
  disabled = false,
  variant = "primary",
}: Props) {
  const variantStyles = {
    primary: {
      base: "bg-accent",
      active: "active:bg-accent-dark",
      text: "text-text-primary",
    },
    secondary: {
      base: "bg-surface-active",
      active: "active:bg-surface",
      text: "text-text-primary",
    },
    danger: {
      base: "bg-danger",
      active: "active:bg-danger-dark",
      text: "text-text-primary",
    },
    ghost: {
      base: "bg-transparent",
      active: "active:bg-background",
      text: "text-accent",
    },
  };

  const styles = variantStyles[variant];

  const disabledStyle = disabled ? "opacity-50" : "";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`px-lg py-md rounded-md ${styles.base} ${styles.active} ${disabledStyle}`}
    >
      <Text className={`text-button font-semibold ${styles.text}`}>
        {title}
      </Text>
    </Pressable>
  );
}

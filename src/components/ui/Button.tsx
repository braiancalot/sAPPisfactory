import { Pressable, Text } from "react-native";

const variantStyles = {
  primary: {
    container: "bg-accent active:bg-accent-dark",
    text: "text-text-primary",
  },
  secondary: {
    container: "bg-surface-3 active:bg-surface-2",
    text: "text-text-primary",
  },
  danger: {
    container: "bg-danger active:bg-danger-dark",
    text: "text-text-primary",
  },
  ghost: {
    container: "bg-transparent active:bg-background",
    text: "text-accent",
  },
};

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
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
  const disabledStyle = disabled ? "opacity-40" : "";
  const widthStyle = fullWidth ? "flex-1" : "min-w-[120px]";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`px-lg py-md rounded-md ${styles.container} ${disabledStyle} ${widthStyle} items-center justify-center active:scale-95 active:opacity-90`}
    >
      <Text className={`text-button font-semibold ${styles.text}`}>
        {title}
      </Text>
    </Pressable>
  );
}

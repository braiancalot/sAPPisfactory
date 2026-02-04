import { Pressable } from "react-native";
import Text, { TextVariant } from "@ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

const variantStyles = {
  primary: {
    container: "bg-primary active:bg-primary-dark",
    containerDisabled: "bg-primary-disabled",
    text: "text-text-on-primary",
    textDisabled: "text-text-on-primary",
    iconColor: colors["text-on-primary"],
  },
  secondary: {
    container: "bg-surface-4 active:bg-surface-3",
    containerDisabled: "bg-surface-4",
    text: "text-text-secondary",
    textDisabled: "text-text-secondary",
    iconColor: colors["text-secondary"],
  },
  info: {
    container: "bg-secondary active:bg-secondary-dark",
    containerDisabled: "bg-secondary",
    text: "text-text-on-primary",
    textDisabled: "text-text-on-primary",
    iconColor: colors["text-on-primary"],
  },
  danger: {
    container: "bg-danger active:bg-danger-dark",
    containerDisabled: "bg-danger",
    text: "text-text-on-danger",
    textDisabled: "text-text-on-danger",
    iconColor: colors["text-on-danger"],
  },
  ghost: {
    container: "bg-transparent active:bg-background",
    containerDisabled: "bg-transparent",
    text: "text-secondary",
    textDisabled: "text-secondary",
    iconColor: colors["secondary"],
  },
};

const sizeStyles = {
  sm: {
    container: "px-md py-xs",
    textVariant: "body",
    iconSize: 18,
  },
  md: {
    container: "px-lg py-sm",
    textVariant: "button",
    iconSize: 20,
  },
};

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: keyof typeof variantStyles;
  fullWidth?: boolean;
  size?: keyof typeof sizeStyles;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function Button({
  onPress,
  title,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
}: Props) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const widthStyle = fullWidth ? "w-full flex-1" : "min-w-[120px]";
  const containerBase = `flex-row items-center justify-center rounded-md gap-xs active:scale-98 ${widthStyle}`;

  const containerClass = disabled
    ? variantStyle.containerDisabled
    : variantStyle.container;

  const textClass = disabled ? variantStyle.textDisabled : variantStyle.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${containerBase} ${sizeStyle.container} ${containerClass}`}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={sizeStyle.iconSize}
          color={variantStyle.iconColor}
        />
      )}

      <Text
        variant={sizeStyle.textVariant as TextVariant}
        className={`${textClass}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}

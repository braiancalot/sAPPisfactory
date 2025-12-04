import { colors } from "@theme/colors";
import { memo, useEffect, useRef, useState } from "react";
import { Keyboard, TextInput, TextStyle, View, StyleProp } from "react-native";
import { sanitizeNumericInput } from "src/utils/numberFormat";

import Text from "@ui/Text";
import { typography } from "src/utils/typography";

import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

function getInputClass(variant: string, error: string, isFocused: boolean) {
  if (variant === "borderless") {
    return `px-0 py-0`;
  }

  const borderColor = error
    ? "border-danger"
    : isFocused
      ? "border-primary"
      : "border-border";

  return `bg-field rounded-md px-md py-sm text-text-primary border ${borderColor}`;
}

type Props = {
  value?: string;
  onChangeValue: (newValue: string) => void;
  defaultValue?: string;
  label?: string;
  autoFocus?: boolean;
  placeholder?: string;
  numeric?: boolean;
  error?: string;
  onSubmit?: (value: string) => void;
  onBlur?: () => void;
  variant?: "default" | "borderless";
  className?: string;
  useBottomSheet?: boolean;
  style?: StyleProp<TextStyle>;
};

function Input({
  value,
  onChangeValue,
  defaultValue,
  label,
  autoFocus = false,
  placeholder = "",
  numeric = false,
  error = "",
  onSubmit = () => {},
  onBlur = () => {},
  variant = "default",
  className = "",
  useBottomSheet = false,
  style,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isUncontrolled = defaultValue !== undefined;

  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      if (isFocused) {
        inputRef.current?.blur();
      }
    });

    return () => {
      hideSub.remove();
    };
  }, [isFocused]);

  function handleTextChange(text: string) {
    if (numeric) {
      const sanitized = sanitizeNumericInput(text);
      onChangeValue(sanitized);
    } else {
      onChangeValue(text);
    }
  }

  function handleSubmit() {
    onSubmit(value || "");
  }

  function handleBlur() {
    onBlur();
    setIsFocused(false);
  }

  function handleFocus() {
    setIsFocused(true);
  }

  const InputComponent = useBottomSheet ? BottomSheetTextInput : TextInput;
  const inputClass = getInputClass(variant, error, isFocused);

  return (
    <View className="gap-xs">
      {label && (
        <Text variant="body" className="text-text-secondary">
          {label}
        </Text>
      )}
      <InputComponent
        ref={inputRef as any}
        className={`${inputClass} ${className}`}
        style={[typography.body, { includeFontPadding: false }, style]}
        placeholderTextColor={colors["text-tertiary"]}
        keyboardType={numeric ? "numeric" : "default"}
        placeholder={placeholder || "\u200B"}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        value={isUncontrolled ? undefined : value}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
      />

      {error && (
        <Text variant="footnote" className="text-danger ml-sm">
          {error}
        </Text>
      )}
    </View>
  );
}

export default memo(Input);

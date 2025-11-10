import { colors } from "@theme/colors";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { sanitizeNumericInput } from "src/utils/numberFormat";

type Props = {
  value: string;
  onChangeValue: (newValue: string) => void;
  label?: string;
  autoFocus?: boolean;
  placeholder?: string;
  numeric?: boolean;
  error?: string;
  onSubmit?: (value: string) => void;
  onBlur?: () => void;
};

export default function Input({
  value,
  onChangeValue,
  label,
  autoFocus = false,
  placeholder = "",
  numeric = false,
  error,
  onSubmit = () => {},
  onBlur = () => {},
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

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
    onSubmit(value);
  }

  function handleBlur() {
    onBlur();
    setIsFocused(false);
  }

  function handleFocus() {
    setIsFocused(true);
  }

  const borderColor = error
    ? "border-danger"
    : isFocused
      ? "border-accent"
      : "border-border";

  return (
    <View className="gap-xs">
      {label && (
        <Text className="text-text-primary font-medium text-subhead">
          {label}
        </Text>
      )}
      <TextInput
        ref={inputRef}
        className={`bg-field rounded-md px-lg py-md text-text-primary text-body border ${borderColor}`}
        placeholderTextColor={colors["text-secondary"]}
        keyboardType={numeric ? "numeric" : "default"}
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={value}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
      />

      {error && <Text className="text-danger text-caption ml-sm">{error}</Text>}
    </View>
  );
}

import { colors } from "@theme/colors";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import { sanitizeNumericInput } from "src/utils/numberFormat";

type Props = {
  label?: string;
  placeholder: string;
  numeric?: boolean;
  error?: string;
};

export default function Input({
  label,
  placeholder,
  numeric = false,
  error,
}: Props) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      if (isFocused) {
        console.log("keyboardDidHide → perdeu foco pelo botão voltar");
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
      setValue(sanitized);
    } else {
      setValue(text);
    }
  }

  function handleSubmit() {
    console.log("handleSubmit");
  }

  function handleBlur() {
    console.log("handleBlur");
    setIsFocused(false);
  }

  function handleFocus() {
    console.log("handleFocus");
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
        className={`bg-field rounded-md px-md py-md text-text-primary text-body border ${borderColor}`}
        placeholderTextColor={colors["text-secondary"]}
        keyboardType={numeric ? "numeric" : "default"}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
      />

      {error && <Text className="text-danger text-caption">{error}</Text>}
    </View>
  );
}

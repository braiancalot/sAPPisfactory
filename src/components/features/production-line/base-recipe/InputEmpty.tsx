import { View } from "react-native";

import Text from "@ui/Text";

export default function InputEmpty() {
  return (
    <View className="p-md items-center justify-center border border-dashed border-border rounded-md opacity-50 h-[61]">
      <Text variant="caption" className="text-text-tertiary">
        Nenhum ingrediente cadastrado
      </Text>
    </View>
  );
}

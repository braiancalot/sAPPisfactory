import { View } from "react-native";

import Text from "@ui/Text";

export default function ScaleGroupEmpty() {
  return (
    <View className="p-md items-center justify-center border border-dashed border-border rounded-md opacity-50 h-[56]">
      <Text variant="caption" className="text-text-tertiary">
        Nenhum grupo de construção configurado
      </Text>
    </View>
  );
}

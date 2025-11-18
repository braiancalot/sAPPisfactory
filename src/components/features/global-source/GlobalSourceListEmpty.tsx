import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Text from "@ui/Text";

import { colors } from "@theme/colors";

export default function GlobalSourceListEmpty() {
  return (
    <View className="items-center justify-center py-xl">
      <MaterialIcons name="add-box" size={48} color={colors["text-tertiary"]} />

      <Text variant="subhead" className="text-text-secondary mt-md">
        Nenhuma fonte de global cadastrada
      </Text>

      <Text variant="body" className="text-text-tertiary mt-xs">
        Adicione sua primeira fonte para começar a calcular
      </Text>
    </View>
  );
}

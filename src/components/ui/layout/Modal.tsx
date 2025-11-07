import { View, Modal as RNModal, Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ visible, onClose, title, children }: Props) {
  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-overlay">
        <Pressable
          onPress={onClose}
          className="absolute top-0 left-0 right-0 bottom-0"
        />
        <View
          className="bg-surface p-xl rounded-lg w-[90%] max-w-[500]"
          style={{ elevation: 3 }}
        >
          <View className="flex-row justify-between items-center mb-xl">
            <Text className="text-title text-text-primary font-bold">
              {title}
            </Text>

            <Pressable onPress={onClose}>
              <MaterialIcons
                name="close"
                size={24}
                color={colors["text-secondary"]}
              />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </RNModal>
  );
}

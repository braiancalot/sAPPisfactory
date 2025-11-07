import { View, Text } from "react-native";

import Modal from "@ui/layout/Modal";
import Button from "@ui/input/Button";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: Props) {
  return (
    <Modal visible={visible} title={title} onClose={onCancel}>
      <Text className="text-body text-text-secondary">{message}</Text>

      <View className="mt-xl flex-row gap-lg">
        <Button
          onPress={onCancel}
          variant="secondary"
          title={cancelText}
          fullWidth
        />

        <Button
          onPress={onConfirm}
          variant="danger"
          title={confirmText}
          fullWidth
        />
      </View>
    </Modal>
  );
}

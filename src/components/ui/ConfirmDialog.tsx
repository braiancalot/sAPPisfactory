import { View, Text } from "react-native";

import Modal from "@ui/Modal";
import Button from "@ui/Button";

type Props = {
  visible: boolean;
  title: string;
  message: string | React.ReactNode;
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
      {typeof message === "string" ? (
        <Text className="text-body text-text-secondary">{message}</Text>
      ) : (
        <View>{message}</View>
      )}

      <View className="mt-xl flex-row gap-md">
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

import { useEffect, useState } from "react";
import { View } from "react-native";

import Modal from "@ui/Modal";
import Input from "@ui/Input";
import Button from "@ui/Button";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => Promise<void>;
};

export default function AddFactoryModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (visible) {
      setName("");
    }
  }, [visible]);

  function handleClose() {
    onClose();
  }

  function handleAdd() {
    if (!isValid) return;
    onAdd(name);
    handleClose();
  }

  const isValid = !!name;

  return (
    <Modal visible={visible} onClose={handleClose} title="Adicionar fábrica">
      <View className="gap-lg">
        <Input
          label="Nome"
          placeholder="Siderúrgica "
          value={name}
          onChangeValue={setName}
          autoFocus
        />
      </View>

      <View className="flex-row gap-md mt-2xl">
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={handleClose}
          fullWidth
        />
        <Button
          title="Adicionar"
          variant="primary"
          onPress={handleAdd}
          fullWidth
          disabled={!isValid}
        />
      </View>
    </Modal>
  );
}

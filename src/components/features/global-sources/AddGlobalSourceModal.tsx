import { useEffect, useState } from "react";
import { View } from "react-native";

import { ItemId } from "src/data/item";
import { parsePtBrNumber } from "src/utils/numberFormat";

import Modal from "@ui/Modal";
import Input from "@ui/Input";
import Button from "@ui/Button";
import ItemPicker from "@ui/ItemPicker";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: ItemId, rate: number) => Promise<void>;
};

export default function AddGlobalSourceModal({
  visible,
  onClose,
  onAdd,
}: Props) {
  const [rate, setRate] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedItemId(null);
      setRate("");
    }
  }, [visible]);

  function handleClose() {
    onClose();
  }

  function handleAdd() {
    if (!isValid) return;
    onAdd(selectedItemId, parsePtBrNumber(rate));
    handleClose();
  }

  const isValid = selectedItemId !== null && !!rate;

  return (
    <Modal visible={visible} onClose={handleClose} title="Adicionar fonte">
      <View className="gap-lg">
        <ItemPicker
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          label="Item"
        />

        <Input
          label="Produção (por minuto)"
          placeholder="180"
          numeric
          value={rate}
          onChangeValue={setRate}
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

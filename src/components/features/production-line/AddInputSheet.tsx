import { useState, forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";

import Input from "@ui/Input";
import ItemPicker from "@ui/ItemPicker";
import BottomSheet from "@ui/BottomSheet";

import { ItemId } from "@data/item";
import { parsePtBrNumber } from "src/utils/numberFormat";

type Props = {
  onAdd: (item: ItemId, rate: number) => Promise<void>;
};

const AddInputSheet = forwardRef<BottomSheetModal, Props>(({ onAdd }, ref) => {
  const [rate, setRate] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);

  function handleDismiss() {
    setSelectedItemId(null);
    setRate("");
  }

  async function handleAdd() {
    if (!selectedItemId || !rate) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await onAdd(selectedItemId, parsePtBrNumber(rate));
  }

  const isValid = selectedItemId !== null && !!rate;

  return (
    <BottomSheet
      ref={ref}
      title="Adicionar ingrediente"
      onConfirm={handleAdd}
      onDismiss={handleDismiss}
      confirmDisabled={!isValid}
    >
      <ItemPicker
        selectedItemId={selectedItemId}
        onSelect={setSelectedItemId}
        label="Item consumido"
      />

      <Input
        label="Taxa base de consumo (por minuto)"
        placeholder="60"
        numeric
        defaultValue=""
        onChangeValue={setRate}
        useBottomSheet
      />
    </BottomSheet>
  );
});

export default AddInputSheet;

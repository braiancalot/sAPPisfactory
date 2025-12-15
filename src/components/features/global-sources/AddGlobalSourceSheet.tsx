import { useState, forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import Input from "@ui/Input";
import ItemPicker from "@ui/ItemPicker";
import BottomSheet from "@ui/BottomSheet";

import { ItemId } from "@data/item";
import { parsePtBrNumber } from "src/utils/numberFormat";

type Props = {
  onAdd: (item: ItemId, rate: number) => Promise<void>;
  excludeItems: ItemId[];
};

const AddGlobalSourceSheet = forwardRef<BottomSheetModal, Props>(
  ({ onAdd, excludeItems }, ref) => {
    const [rate, setRate] = useState("");
    const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);

    function handleDismiss() {
      setSelectedItemId(null);
      setRate("");
    }

    async function handleAdd() {
      if (!selectedItemId || !rate) return;

      await onAdd(selectedItemId, parsePtBrNumber(rate));
    }

    const isValid = selectedItemId !== null && !!rate;

    return (
      <BottomSheet
        ref={ref}
        title="Adicionar fonte"
        onConfirm={handleAdd}
        onDismiss={handleDismiss}
        confirmDisabled={!isValid}
      >
        <ItemPicker
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          label="Item"
          excludeItems={excludeItems}
        />

        <Input
          label="Produção (por minuto)"
          placeholder="180"
          numeric
          defaultValue=""
          onChangeValue={setRate}
          useBottomSheet
        />
      </BottomSheet>
    );
  }
);

export default AddGlobalSourceSheet;

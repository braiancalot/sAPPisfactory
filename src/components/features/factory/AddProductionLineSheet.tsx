import { useState, forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import Text from "@ui/Text";
import Input from "@ui/Input";
import ItemPicker from "@ui/ItemPicker";
import BottomSheet from "@ui/BottomSheet";

import { ItemId } from "@data/item";
import { parsePtBrNumber } from "src/utils/numberFormat";

type Props = {
  onAdd: (item: ItemId, rate: number) => Promise<void>;
};

const AddProductionLineSheet = forwardRef<BottomSheetModal, Props>(
  ({ onAdd }, ref) => {
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
        title="Adicionar linha de produção"
        onConfirm={handleAdd}
        onDismiss={handleDismiss}
        confirmDisabled={!isValid}
      >
        <ItemPicker
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          label="Item produzido"
        />

        <Input
          label="Taxa base de produção (por minuto)"
          placeholder="60"
          numeric
          defaultValue=""
          onChangeValue={setRate}
          useBottomSheet
        />

        <Text variant="caption" className="text-text-tertiary">
          Inputs (ingredientes) são definidos na tela da linha de produção.
        </Text>
      </BottomSheet>
    );
  }
);

export default AddProductionLineSheet;

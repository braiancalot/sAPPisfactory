import { useState, forwardRef } from "react";
import { Keyboard, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ProductionLineInput from "@db/model/ProductionLineInput";

import { parsePtBrNumber, sanitizeNumericInput } from "src/utils/numberFormat";

import Input from "@ui/Input";

import BottomSheet from "@ui/BottomSheet";

type Props = {
  input: ProductionLineInput | null;
  onConfirm: (newRate: number) => void;
  onCancel: () => void;
};

const EditInputSheet = forwardRef<BottomSheetModal, Props>(
  ({ input, onConfirm, onCancel }, ref) => {
    const [newRate, setNewRate] = useState("");

    function handleDismiss() {
      onCancel();
    }

    function handleConfirm() {
      onConfirm(parsePtBrNumber(newRate));
    }

    return (
      <BottomSheet
        ref={ref}
        title="Editar ingrediente"
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
        confirmDisabled={
          !newRate || newRate === input?.inputBaseRate.toString()
        }
        confirmLabel="Salvar"
      >
        <Input
          //   key={input?.id || "no-production-line"}
          label="Taxa base de consumo (por minuto)"
          defaultValue={sanitizeNumericInput(
            input?.inputBaseRate.toString() || "0"
          )}
          onChangeValue={setNewRate}
          useBottomSheet
          numeric
          autoFocus
        />
      </BottomSheet>
    );
  }
);

export default EditInputSheet;

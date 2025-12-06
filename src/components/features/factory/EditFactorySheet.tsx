import { useState, forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import Factory from "@db/model/Factory";

import Input from "@ui/Input";
import BottomSheet from "@ui/BottomSheet";

type Props = {
  factory: Factory | null;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
};

const EditFactorySheet = forwardRef<BottomSheetModal, Props>(
  ({ factory, onConfirm, onCancel }, ref) => {
    const [newName, setNewName] = useState("");

    function handleDismiss() {
      onCancel();
    }

    function handleConfirm() {
      onConfirm(newName);
    }

    return (
      <BottomSheet
        ref={ref}
        title="Editar fábrica"
        onConfirm={handleConfirm}
        onDismiss={handleDismiss}
        confirmDisabled={
          !newName || newName.trim().length === 0 || newName === factory?.name
        }
        confirmLabel="Salvar"
      >
        <Input
          key={factory?.id || "no-factory"}
          label="Nome"
          defaultValue={factory?.name || ""}
          onChangeValue={setNewName}
          useBottomSheet
          autoFocus
        />
      </BottomSheet>
    );
  }
);

export default EditFactorySheet;

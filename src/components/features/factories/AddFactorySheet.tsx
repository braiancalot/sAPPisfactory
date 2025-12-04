import { useState, forwardRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";

import Input from "@ui/Input";
import BottomSheet from "@ui/BottomSheet";

type Props = {
  onAdd: (name: string) => Promise<void>;
};

const AddFactorySheet = forwardRef<BottomSheetModal, Props>(
  ({ onAdd }, ref) => {
    const [name, setName] = useState("");

    function handleDismiss() {
      setName("");
    }

    async function handleAdd() {
      if (!name) return;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onAdd(name);
    }

    return (
      <BottomSheet
        ref={ref}
        title="Adicionar fábrica"
        onConfirm={handleAdd}
        onDismiss={handleDismiss}
        confirmDisabled={!name}
      >
        <Input
          label="Nome"
          defaultValue=""
          onChangeValue={setName}
          useBottomSheet
          autoFocus
        />
      </BottomSheet>
    );
  }
);

export default AddFactorySheet;

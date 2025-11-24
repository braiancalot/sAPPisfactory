import { useState, forwardRef } from "react";
import { Keyboard, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import Factory from "@db/model/Factory";

import { useBottomSheetBackHandler } from "@hooks/useBottomSheetBackHandler";

import Button from "@ui/Button";
import Text from "@ui/Text";
import Input from "@ui/Input";

import { colors } from "@theme/colors";

type Props = {
  factory: Factory | null;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
};

const EditFactorySheet = forwardRef<BottomSheetModal, Props>(
  ({ factory, onConfirm, onCancel }, ref) => {
    const [newName, setNewName] = useState("");

    const { handleSheetChanges } = useBottomSheetBackHandler(ref);

    function handleDismiss() {
      Keyboard.dismiss();
      onCancel();
    }

    function handleConfirm() {
      onConfirm(newName);
    }

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors["surface-2"] }}
        handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
        onDismiss={handleDismiss}
        onChange={handleSheetChanges}
      >
        <BottomSheetView className="pb-lg">
          <View className="px-lg pb-md border-b border-border">
            <Text variant="title" className="text-text-primary">
              Editar fábrica
            </Text>
          </View>

          <View className="px-lg mt-lg">
            <Input
              key={factory?.id || "no-factory"}
              label="Nome"
              defaultValue={factory?.name || ""}
              onChangeValue={setNewName}
              useBottomSheet
            />
          </View>

          <View className="mt-2xl px-lg flex-row gap-md">
            <Button
              onPress={() => {
                if (ref && "current" in ref) {
                  ref.current?.dismiss();
                }
              }}
              variant="secondary"
              title="Cancelar"
              fullWidth
            />

            <Button
              onPress={handleConfirm}
              variant="primary"
              title="Salvar"
              fullWidth
              disabled={
                !newName ||
                newName.trim().length === 0 ||
                newName === factory?.name
              }
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );
}

export default EditFactorySheet;

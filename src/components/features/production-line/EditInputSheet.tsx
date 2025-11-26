import { useState, forwardRef } from "react";
import { Keyboard, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import ProductionLineInput from "@db/model/ProductionLineInput";

import { useBottomSheetBackHandler } from "@hooks/useBottomSheetBackHandler";
import { parsePtBrNumber, sanitizeNumericInput } from "src/utils/numberFormat";

import Button from "@ui/Button";
import Text from "@ui/Text";
import Input from "@ui/Input";

import { colors } from "@theme/colors";

type Props = {
  input: ProductionLineInput | null;
  onConfirm: (newRate: number) => void;
  onCancel: () => void;
};

const EditInputSheet = forwardRef<BottomSheetModal, Props>(
  ({ input, onConfirm, onCancel }, ref) => {
    const [newRate, setNewRate] = useState("");

    const { handleSheetChanges } = useBottomSheetBackHandler(ref);

    function handleDismiss() {
      Keyboard.dismiss();
      onCancel();
    }

    function handleConfirm() {
      onConfirm(parsePtBrNumber(newRate));
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
              Editar ingrediente
            </Text>
          </View>

          <View className="px-lg mt-lg">
            <Input
              key={input?.id || "no-production-line"}
              label="Taxa base de consumo (por minuto)"
              defaultValue={sanitizeNumericInput(
                input?.inputBaseRate.toString() || "0"
              )}
              onChangeValue={setNewRate}
              useBottomSheet
              numeric
              autoFocus
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
              disabled={!newRate || newRate === input?.inputBaseRate.toString()}
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

export default EditInputSheet;

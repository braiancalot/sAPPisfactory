import { useState, forwardRef } from "react";
import { View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { useBottomSheetBackHandler } from "@hooks/useBottomSheetBackHandler";

import Button from "@ui/Button";
import Text from "@ui/Text";
import Input from "@ui/Input";
import ItemPicker from "@ui/ItemPicker";

import { colors } from "@theme/colors";
import { ItemId } from "@data/item";
import { parsePtBrNumber } from "src/utils/numberFormat";

type Props = {
  onAdd: (item: ItemId, rate: number) => Promise<void>;
};

const AddProductionLineSheet = forwardRef<BottomSheetModal, Props>(
  ({ onAdd }, ref) => {
    const [rate, setRate] = useState("");
    const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);
    const { handleSheetChanges } = useBottomSheetBackHandler(ref);

    function handleDismiss() {
      setSelectedItemId(null);
      setRate("");
    }

    async function handleAdd() {
      if (!selectedItemId || !rate) return;
      await onAdd(selectedItemId, parsePtBrNumber(rate));
      if (ref && "current" in ref) ref.current?.dismiss();
    }

    const isValid = selectedItemId !== null && !!rate;

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
              Adicionar linha de produção
            </Text>
          </View>

          <View className="px-lg mt-lg gap-lg">
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
          </View>

          <View className="flex-row gap-md mt-2xl px-lg">
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={() => {
                if (ref && "current" in ref) ref.current?.dismiss();
              }}
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

export default AddProductionLineSheet;

import { useState, forwardRef } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

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

import { colors } from "@theme/colors";

type Props = {
  onAdd: (name: string) => Promise<void>;
};

const AddFactorySheet = forwardRef<BottomSheetModal, Props>(
  ({ onAdd }, ref) => {
    const [name, setName] = useState("");
    const { handleSheetChanges } = useBottomSheetBackHandler(ref);

    function handleDismiss() {
      setName("");
    }

    async function handleAdd() {
      if (!name) return;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onAdd(name);

      if (ref && "current" in ref) ref.current?.dismiss();
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
              Adicionar fábrica
            </Text>
          </View>

          <View className="px-lg mt-lg">
            <Input
              label="Nome"
              defaultValue=""
              onChangeValue={setName}
              useBottomSheet
              autoFocus
            />
          </View>

          <View className="mt-2xl px-lg flex-row gap-md">
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
              disabled={!name}
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

export default AddFactorySheet;

import { forwardRef } from "react";
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

import { colors } from "@theme/colors";

type Props = {
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmDialog = forwardRef<BottomSheetModal, Props>(
  (
    {
      title,
      message,
      onConfirm,
      onCancel,
      confirmText = "Confirmar",
      cancelText = "Cancelar",
    },
    ref
  ) => {
    const { handleSheetChanges } = useBottomSheetBackHandler(ref);

    function handleDismiss() {
      onCancel();
    }

    function handleConfirm() {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onConfirm();
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
        <BottomSheetView>
          <View className="pb-lg">
            <View className="px-lg pb-md border-b border-border">
              <Text variant="title" className="text-text-primary">
                {title}
              </Text>
            </View>

            <View className="px-lg mt-lg">
              {typeof message === "string" ? (
                <Text variant="body" className="text-text-secondary">
                  {message}
                </Text>
              ) : (
                <View>{message}</View>
              )}
            </View>

            <View className="mt-2xl px-lg flex-row gap-md">
              <Button
                onPress={onCancel}
                variant="secondary"
                title={cancelText}
                fullWidth
              />

              <Button
                onPress={handleConfirm}
                variant="danger"
                title={confirmText}
                fullWidth
              />
            </View>
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

export default ConfirmDialog;

import { forwardRef, useCallback } from "react";
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
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  onDismiss?: () => void;
  confirmDisabled?: boolean;
};

const BottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    {
      title,
      children,
      confirmLabel = "Adicionar",
      cancelLabel = "Cancelar",
      onConfirm,
      onDismiss,
      confirmDisabled = false,
    },
    ref
  ) => {
    const { handleSheetChanges } = useBottomSheetBackHandler(ref);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      []
    );

    async function handleConfirmPress() {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await onConfirm();
      if (ref && "current" in ref) ref.current?.dismiss();
    }

    function handleCancelPress() {
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
        onDismiss={onDismiss}
        onChange={handleSheetChanges}
      >
        <BottomSheetView className="pb-lg">
          <View className="px-lg pb-md border-b border-border">
            <Text variant="title" className="text-text-primary">
              {title}
            </Text>
          </View>

          <View className="px-lg mt-lg gap-lg">{children}</View>

          <View className="mt-2xl px-lg flex-row gap-md">
            <Button
              title={cancelLabel}
              variant="secondary"
              onPress={handleCancelPress}
              fullWidth
            />

            <Button
              title={confirmLabel}
              variant="primary"
              onPress={handleConfirmPress}
              fullWidth
              disabled={confirmDisabled}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default BottomSheet;

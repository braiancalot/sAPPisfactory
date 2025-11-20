import { useEffect, useRef } from "react";

import { BackHandler, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import Button from "@ui/Button";
import Text from "@ui/Text";

import { colors } from "@theme/colors";

type Props = {
  visible: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }

    if (!visible) return;

    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      bottomSheetRef.current?.dismiss();
      onCancel();
      return true;
    });

    return () => sub.remove();
  }, [visible]);

  function handleSheetChange(index: number) {
    if (index === -1) {
      onCancel();
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors["surface-2"] }}
      handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
      onChange={handleSheetChange}
      animationConfigs={{ velocity: 1000 }}
    >
      <BottomSheetView>
        <View className="px-lg pb-lg">
          <View className="pt-md pb-lg">
            <Text variant="title" className="text-text-primary">
              {title}
            </Text>
          </View>

          {typeof message === "string" ? (
            <Text variant="body" className="text-text-secondary">
              {message}
            </Text>
          ) : (
            <View>{message}</View>
          )}

          <View className="mt-2xl flex-row gap-md">
            <Button
              onPress={onCancel}
              variant="secondary"
              title={cancelText}
              fullWidth
            />

            <Button
              onPress={onConfirm}
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

import { View } from "react-native";
import { useRef } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Button from "@ui/Button";
import Text from "@ui/Text";

export default function FactoryScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View className="bg-background flex-1">
      <Button title="Abrir" onPress={() => bottomSheetRef.current?.expand()} />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        enablePanDownToClose
      >
        <BottomSheetView className="p-lg bg-surface-2">
          <Text variant="body" className="text-text-primary">
            Awesome
          </Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

import { forwardRef } from "react";
import { Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { useBottomSheetBackHandler } from "src/hooks/useBottomSheetBackHandler";

import Text from "@ui/Text";

import { colors } from "@theme/colors";

export type MenuItem = {
  label: string;
  onPress: () => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  isDestructive?: boolean;
};

type Props = {
  options: MenuItem[];
};

const MenuSheet = forwardRef<BottomSheetModal, Props>(({ options }, ref) => {
  const { handleSheetChanges } = useBottomSheetBackHandler(ref);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      enableDynamicSizing={true}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors["surface-2"] }}
      handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
      onChange={handleSheetChanges}
    >
      <BottomSheetView className="pb-md">
        <View className="gap-2xs">
          {options.map((option) => (
            <View key={option.label}>
              <Pressable
                className="px-md py-md flex-row items-center gap-md active:bg-surface-3"
                onPress={() => {
                  if (ref && "current" in ref) {
                    ref?.current?.close();
                  }

                  option.onPress();
                }}
              >
                <MaterialIcons
                  name={option.icon}
                  size={22}
                  color={
                    option.isDestructive
                      ? colors.danger
                      : colors["text-secondary"]
                  }
                />
                <Text variant="body" className={"text-text-primary"}>
                  {option.label}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

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

export default MenuSheet;

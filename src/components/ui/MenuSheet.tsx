import { forwardRef } from "react";
import { Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
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

  const snapPoints = [`${4 + 5.5 * options.length}%`];

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors["surface-2"] }}
      handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
      onChange={handleSheetChanges}
    >
      <View className="gap-xs">
        {options.map((option) => (
          <View key={option.label}>
            <Pressable
              className="px-md py-sm flex-row justify-start items-center gap-md active:bg-surface-1"
              onPress={() => {
                if (ref && "current" in ref) {
                  ref?.current?.close();
                }

                option.onPress();
              }}
            >
              <MaterialIcons
                name={option.icon}
                size={18}
                color={
                  option.isDestructive
                    ? colors.danger
                    : colors["text-secondary"]
                }
              />
              <Text
                variant="subhead"
                className={
                  option.isDestructive ? "text-danger" : "text-text-primary"
                }
              >
                {option.label}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
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

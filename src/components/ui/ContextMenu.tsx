import { useRef } from "react";
import { Keyboard, Pressable, View } from "react-native";
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
};

type Props = {
  options: MenuItem[];
};

export default function ContextMenu({ options }: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { handleSheetChanges } = useBottomSheetBackHandler(bottomSheetRef);

  function handleOpen() {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  }

  function handleClose() {
    bottomSheetRef.current?.close();
  }

  return (
    <>
      <Pressable
        className="p-xs rounded-full active:bg-surface-4"
        onPress={handleOpen}
      >
        <MaterialIcons
          name="more-vert"
          size={20}
          color={colors["text-secondary"]}
        />
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={[`${4 + 5.5 * options.length}`]}
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
                  handleClose();
                  option.onPress();
                }}
              >
                <MaterialIcons
                  name={option.icon}
                  size={18}
                  color={colors["text-secondary"]}
                />
                <Text variant="subhead" className="text-text-primary">
                  {option.label}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </BottomSheetModal>
    </>
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

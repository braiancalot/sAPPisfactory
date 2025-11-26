import { useRef } from "react";
import { Keyboard, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { colors } from "@theme/colors";

import MenuSheet, { MenuItem } from "./MenuSheet";

type Props = {
  options: MenuItem[];
};

export default function ContextMenu({ options }: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  function handleOpen() {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
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

      <MenuSheet ref={bottomSheetRef} options={options} />
    </>
  );
}

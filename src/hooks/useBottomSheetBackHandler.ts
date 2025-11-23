import {
  ForwardedRef,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BackHandler } from "react-native";

export function useBottomSheetBackHandler(
  ref: RefObject<BottomSheetModal> | ForwardedRef<BottomSheetModal> | null
) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss();
          return true;
        }
        return false;
      }
    );

    return () => subscription.remove();
  }, [isOpen, ref]);

  return { handleSheetChanges };
}

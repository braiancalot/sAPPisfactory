import { useCallback, useEffect, useState } from "react";
import { View, Pressable, Modal as RNModal } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

import Text from "@ui/Text";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ visible, onClose, title, children }: Props) {
  const [isRendered, setIsRendered] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);
  const modalOpacity = useSharedValue(0);

  const startEntranceAnimation = useCallback(() => {
    backdropOpacity.value = withTiming(1, { duration: 200 });
    modalOpacity.value = withTiming(1, { duration: 150 });
    modalScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
      mass: 0.3,
    });
  }, []);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      setIsLayoutReady(false);
    } else {
      backdropOpacity.value = withTiming(0, { duration: 150 });
      modalScale.value = withTiming(0.9, { duration: 150 });
      modalOpacity.value = withTiming(0, { duration: 150 }, (finished) => {
        if (finished) {
          scheduleOnRN(setIsRendered, false);
          scheduleOnRN(setIsLayoutReady, false);
        }
      });
    }
  }, [visible]);

  const handleOnLayout = useCallback(() => {
    if (isRendered && !isLayoutReady) {
      setIsLayoutReady(true);
      startEntranceAnimation();
    }
  }, [isRendered, isLayoutReady]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  if (!isRendered) return null;

  return (
    <RNModal
      visible={isRendered}
      onRequestClose={onClose}
      transparent
      statusBarTranslucent
      animationType="none"
      hardwareAccelerated={true}
    >
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <View
            className="flex-1 items-center justify-center"
            onLayout={handleOnLayout}
          >
            <Animated.View
              className="bg-overlay absolute top-0 left-0 right-0 bottom-0"
              style={backdropStyle}
            >
              <Pressable
                onPress={onClose}
                className="absolute top-0 left-0 right-0 bottom-0"
              />
            </Animated.View>

            <Animated.View
              className="w-full items-center justify-center"
              style={modalStyle}
            >
              <View className="bg-surface-2 rounded-lg w-[90%] max-w-[500]">
                <View className="flex-row justify-between items-center px-lg pt-lg pb-md border-b border-border">
                  <Text variant="title" className="text-text-primary">
                    {title}
                  </Text>

                  <Pressable onPress={onClose} className="active:scale-95">
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={colors["text-secondary"]}
                    />
                  </Pressable>
                </View>

                <View className="px-lg py-lg">{children}</View>
              </View>
            </Animated.View>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RNModal>
  );
}

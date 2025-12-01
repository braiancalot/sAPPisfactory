import Animated, {
  FadeInLeft,
  FadeOut,
  interpolateColor,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions, Pressable, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  shouldResetOnAction?: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

export default function SwipeableCard({
  children,
  onPress,
  onDelete,
  disabled = false,
  shouldResetOnAction = true,
}: Props) {
  const translateX = useSharedValue(0);
  const isPressed = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-20, 1000])
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = 0;
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      const shouldTrigger = translateX.value < TRANSLATE_X_THRESHOLD;

      if (shouldTrigger && onDelete) {
        if (!shouldResetOnAction) {
          translateX.value = withTiming(
            -SCREEN_WIDTH,
            undefined,
            (isFinished) => {
              if (isFinished) {
                runOnJS(onDelete)();
              }
            }
          );
        } else {
          runOnJS(onDelete)();
        }
      }

      translateX.value = withSpring(0, {
        mass: 1,
        damping: 50,
        stiffness: 300,
        overshootClamping: true,
      });
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isPressed.value ? 1 : 0,
      [0, 1],
      [colors["surface-2"], colors["surface-3"]]
    );

    const scale = withSpring(isPressed.value ? 0.99 : 1, {
      mass: 0.5,
      damping: 20,
      stiffness: 400,
    });

    return {
      transform: [{ translateX: translateX.value }, { scale: scale }],
      backgroundColor,
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -100 ? 1 : 0);
    return { opacity };
  });

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOut.duration(100)}
      layout={LinearTransition.springify()}
      className="relative w-full"
    >
      <View className="absolute right-0 top-0 bottom-0 w-full rounded-lg justify-center items-end pr-6">
        <Animated.View
          style={[rIconStyle, { overflow: "hidden", borderRadius: 14 }]}
        >
          <MaterialIcons name="delete" size={24} color={colors.danger} />
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={rStyle} className="p-md rounded-lg">
          <Pressable onPress={onPress} disabled={disabled} className="w-full">
            {children}
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

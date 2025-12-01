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
import { Dimensions, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  shouldResetOnAction?: boolean;
  backgroundColor?: string;
  activeBackgroundColor?: string;
  className?: string;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

export default function SwipeableCard({
  children,
  onPress,
  onDelete,
  disabled = false,
  shouldResetOnAction = true,
  backgroundColor = colors["surface-2"],
  activeBackgroundColor = colors["surface-3"],
  className = "",
}: Props) {
  const translateX = useSharedValue(0);
  const isPressed = useSharedValue(false);
  const isSwiping = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-20, 1000])
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((event) => {
      if (Math.abs(event.translationX) > 5) {
        isSwiping.value = true;
      }

      if (event.translationX > 0) {
        translateX.value = 0;
      } else {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      const shouldTrigger = translateX.value < TRANSLATE_X_THRESHOLD;

      if (shouldTrigger && onDelete) {
        // runOnJS(Haptics.notificationAsync)(
        //   Haptics.NotificationFeedbackType.Success
        // );
        runOnJS(onDelete)();

        if (!shouldResetOnAction) {
          translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
          return;
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
      isSwiping.value = false;
      isPressed.value = false;
    });

  const tapGesture = Gesture.Tap()
    .enabled(!!onPress && !disabled)
    .onBegin(() => {
      isPressed.value = true;
    })
    .onFinalize(() => {
      isPressed.value = false;
    })
    .onEnd(() => {
      if (onPress && !isSwiping.value) {
        runOnJS(onPress)();
      }
    });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  const rStyle = useAnimatedStyle(() => {
    const scale = onPress
      ? withSpring(isPressed.value ? 0.99 : 1, {
          mass: 0.5,
          damping: 20,
          stiffness: 400,
        })
      : 1;

    const bgColor = interpolateColor(
      isPressed.value || isSwiping.value ? 1 : 0,
      [0, 1],
      [backgroundColor, activeBackgroundColor]
    );

    return {
      transform: [{ translateX: translateX.value }, { scale }],
      backgroundColor: bgColor,
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -100 ? 1 : 0);
    return { opacity };
  });

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify().damping(15)}
      className="relative w-full"
    >
      <View className="absolute right-0 top-0 bottom-0 w-full justify-center items-end pr-6">
        <Animated.View style={rIconStyle}>
          <MaterialIcons name="delete" size={24} color={colors.danger} />
        </Animated.View>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={rStyle} className={className}>
          {children}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

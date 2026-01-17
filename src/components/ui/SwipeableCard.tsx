import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";

import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  disableSwipe?: boolean;
  disablePress?: boolean;
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
  onLongPress,
  disabled = false,
  disableSwipe = false,
  disablePress = false,
  shouldResetOnAction = false,
  backgroundColor = colors["surface-2"],
  activeBackgroundColor = colors["surface-3"],
  className = "",
}: Props) {
  const translateX = useSharedValue(0);
  const isPressed = useSharedValue(false);
  const isSwiping = useSharedValue(false);
  const hapticTriggered = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .enabled(!disabled && !disableSwipe)
    .activeOffsetX([-20, 1000])
    .onBegin(() => {
      isSwiping.value = false;
      hapticTriggered.value = false;
    })
    .onUpdate((event) => {
      const startedSwiping = Math.abs(event.translationX) > 5;

      if (startedSwiping) {
        isSwiping.value = true;
      }

      const passedThreshold = event.translationX < TRANSLATE_X_THRESHOLD;

      if (passedThreshold && !hapticTriggered.value) {
        hapticTriggered.value = true;

        scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Medium);
      } else if (!passedThreshold && hapticTriggered.value) {
        hapticTriggered.value = false;
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
        scheduleOnRN(onDelete);

        if (!shouldResetOnAction) {
          scheduleOnRN(
            Haptics.notificationAsync,
            Haptics.NotificationFeedbackType.Error
          );
          translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
          return;
        }
      }

      translateX.value = withSpring(0, {
        mass: 1,
        damping: 60,
        stiffness: 500,
        overshootClamping: true,
      });
    })
    .onFinalize(() => {
      isSwiping.value = false;
      hapticTriggered.value = false;
    });

  const rStyle = useAnimatedStyle(() => {
    const scale = onPress
      ? withTiming(isPressed.value ? 0.985 : 1, {
          duration: 150,
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
    const opacity = withTiming(
      translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0,
      {
        duration: 200,
      }
    );
    return { opacity };
  });

  function handlePressIn() {
    isPressed.value = true;
  }

  function handlePressOut() {
    isPressed.value = false;
  }

  function handlePress() {
    if (!isSwiping.value && onPress && !disablePress) {
      onPress();
    }
  }

  const content = onPress ? (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
    >
      {children}
    </Pressable>
  ) : (
    <View>{children}</View>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(250)}
      layout={LinearTransition.duration(150)}
      className="relative w-full"
    >
      <View className="absolute right-0 top-0 bottom-0 w-full justify-center items-end pr-6">
        <Animated.View style={rIconStyle}>
          <MaterialIcons name="delete" size={24} color={colors.danger} />
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={rStyle} className={className}>
          {content}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as SystemUI from "expo-system-ui";

import "../global.css";
import { colors } from "@theme/colors";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(colors.background);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    InterRegular: require("../src/assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("../src/assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../src/assets/fonts/Inter-SemiBold.ttf"),
    InterBold: require("../src/assets/fonts/Inter-Bold.ttf"),
    InterExtraBold: require("../src/assets/fonts/Inter-ExtraBold.ttf"),
    RajdhaniBold: require("../src/assets/fonts/Rajdhani-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <StatusBar
          style="dark"
          translucent={false}
          backgroundColor={colors["surface-2"]}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

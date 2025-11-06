import { StyleSheet, Text, View } from "react-native";

export default function FactoriesScreen() {
  return (
    <View className="bg-background flex-1 justify-center items-center">
      <Text className="text-bold text-title text-text-primary">
        Factories Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { View, Text, StyleSheet } from "react-native";

export default function FactoryScreen() {
  return (
    <View style={styles.container}>
      <Text>Factory Screen</Text>
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

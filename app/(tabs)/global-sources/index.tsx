import { Button, StyleSheet, View } from "react-native";

import GlobalSourceList from "../../../src/components/GlobalSourceList";

export default function GlobalSourcesScreen() {
  return (
    <View style={styles.container}>
      <GlobalSourceList />

      <Button title="Adicionar recurso global" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 16,
  },
});

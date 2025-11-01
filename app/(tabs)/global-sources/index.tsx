import { Button, StyleSheet, View } from "react-native";

import GlobalSourceList from "../../../src/components/GlobalSourceList";
import database from "../../../src/database";

export default function GlobalSourcesScreen() {
  function handlePress() {
    const GlobalResourceCollection = database.get("global_sources");
  }

  return (
    <View style={styles.container}>
      <GlobalSourceList />

      <Button title="Adicionar recurso global" />

      <Button title="Read" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 16,
  },
});

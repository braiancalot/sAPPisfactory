import { Button, StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";

import GlobalSourceList from "../../../src/components/GlobalSourceList";
import database, { globalSourcesCollection } from "../../../src/db";

export default function GlobalSourcesScreen() {
  const [newItem, setNewItem] = useState("");

  async function handlePress() {
    await database.write(async () => {
      await globalSourcesCollection.create((globalSource) => {
        globalSource.item = newItem;
        globalSource.totalRatePerMin = 0;
      });
    });

    setNewItem("");
  }

  async function handleTestUpdate() {
    await database.write(async () => {
      const globalSources = await globalSourcesCollection.query().fetch();
      const firstGlobalSource = globalSources[0];
      firstGlobalSource.update((globalSource) => {
        globalSource.totalRatePerMin = 300;
      });
    });
  }

  return (
    <View style={styles.container}>
      <GlobalSourceList />

      <TextInput
        value={newItem}
        onChangeText={setNewItem}
        placeholder="Item"
        placeholderTextColor="#c3c3c3"
        style={styles.textInput}
      />

      <Button title="Adicionar recurso global" onPress={handlePress} />
      <Button title="Teste update" onPress={handleTestUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 16,
  },
  textInput: {
    backgroundColor: "#FFF",
    color: "#000",
  },
});

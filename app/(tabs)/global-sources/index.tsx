import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import GlobalSourceList from "../../../src/components/GlobalSourceList";
import database, { globalSourcesCollection } from "../../../src/db";

import FloatingActionButton from "../../../src/components/FloatingActionButton";
import BasicModal from "../../../src/components/BasicModal";

export default function GlobalSourcesScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  function handlePress() {
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleAdd(item: string, rate: number) {
    await database.write(async () => {
      await globalSourcesCollection.create((globalSource) => {
        globalSource.item = item;
        globalSource.totalRatePerMin = rate;
      });
    });

    handleCloseModal();
  }

  //   async function handleTestUpdate() {
  //     await database.write(async () => {
  //       const globalSources = await globalSourcesCollection.query().fetch();
  //       const firstGlobalSource = globalSources[0];
  //       firstGlobalSource.update((globalSource) => {
  //         globalSource.totalRatePerMin = 300;
  //       });
  //     });
  //   }

  return (
    <View style={styles.container}>
      <GlobalSourceList />

      <FloatingActionButton onPress={handlePress} />

      <BasicModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onAdd={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

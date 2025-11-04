import { View } from "react-native";

import GlobalSourceList from "../../../src/components/GlobalSourceList";
import database, { globalSourcesCollection } from "../../../src/db";

export default function GlobalSourcesScreen() {
  function handleFABPress() {}

  async function handleAdd(item: string, rate: number) {
    await database.write(async () => {
      await globalSourcesCollection.create((globalSource) => {
        globalSource.item = item;
        globalSource.totalRatePerMin = rate;
      });
    });
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
    <View className="flex-1 relative">
      <GlobalSourceList />
    </View>
  );
}

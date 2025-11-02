import { FlatList } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import { globalSourcesCollection } from "../db";
import GlobalSource from "../db/model/GlobalSource";

import GlobalSourceListItem from "./GlobalSourceListItem";

function GlobalSourceList({
  globalSources,
}: {
  globalSources: GlobalSource[];
}) {
  return (
    <FlatList
      data={globalSources}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }) => <GlobalSourceListItem globalSource={item} />}
    />
  );
}

const enhance = withObservables([], () => ({
  globalSources: globalSourcesCollection.query(),
}));

export default enhance(GlobalSourceList);

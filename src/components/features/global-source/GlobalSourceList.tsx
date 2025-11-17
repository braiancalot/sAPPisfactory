import { globalSourcesCollection } from "@db/index";
import GlobalSource from "@db/model/GlobalSource";
import { withObservables } from "@nozbe/watermelondb/react";

import GlobalSourceCard from "./GlobalSourceCard";

import { FlatList } from "react-native";

type Props = {
  globalSources: GlobalSource[];
  onUpdateGlobalSource: (source: GlobalSource, newRate: number) => void;
  onDeleteGlobalSource: (source: GlobalSource) => void;
};

function GlobalSourceList({
  globalSources,
  onUpdateGlobalSource,
  onDeleteGlobalSource,
}: Props) {
  return (
    <FlatList
      data={globalSources}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <GlobalSourceCard
          globalSource={item}
          onUpdate={onUpdateGlobalSource}
          onDelete={onDeleteGlobalSource}
        />
      )}
      contentContainerClassName="gap-md p-lg pb-[76]"
    />
  );
}

const enhance = withObservables([], () => ({
  globalSources: globalSourcesCollection.query(),
}));

export default enhance(GlobalSourceList);

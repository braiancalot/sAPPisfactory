import { globalSourcesCollection } from "@db/index";
import GlobalSource from "@db/model/GlobalSource";
import { withObservables } from "@nozbe/watermelondb/react";

import GlobalSourceCard from "@features/global-sources/GlobalSourceCard";
import GlobalSourceListEmpty from "@features/global-sources/GlobalSourceListEmpty";

import { FlatList } from "react-native";

type ExternalProps = {
  onUpdateGlobalSource: (source: GlobalSource, newRate: number) => void;
  onDeleteGlobalSource: (source: GlobalSource) => void;
};

type Props = ExternalProps & {
  globalSources: GlobalSource[];
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
      contentContainerClassName="px-md py-lg pb-[96] gap-md"
      ListEmptyComponent={GlobalSourceListEmpty}
    />
  );
}

const enhance = withObservables([], () => ({
  globalSources: globalSourcesCollection.query(),
}));

export default enhance(GlobalSourceList) as React.ComponentType<ExternalProps>;

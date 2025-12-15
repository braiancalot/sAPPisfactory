import { useCallback } from "react";
import { FlatList } from "react-native";

import GlobalSource from "@db/model/GlobalSource";

import { useGlobalBalance } from "@hooks/useGlobalBalance";

import GlobalSourceCard from "@features/global-sources/GlobalSourceCard";
import GlobalSourceListEmpty from "@features/global-sources/GlobalSourceListEmpty";

type Props = {
  globalSources: GlobalSource[];
  onUpdateGlobalSource: (source: GlobalSource, newRate: number) => void;
  onDeleteGlobalSource: (source: GlobalSource) => void;
};

export default function GlobalSourceList({
  globalSources,
  onUpdateGlobalSource,
  onDeleteGlobalSource,
}: Props) {
  const { getGlobalSourceBalance } = useGlobalBalance();

  const renderItem = useCallback(
    ({ item }: { item: GlobalSource }) => {
      const balance = getGlobalSourceBalance(item.id);

      return (
        <GlobalSourceCard
          globalSource={item}
          balance={balance}
          onUpdate={onUpdateGlobalSource}
          onDelete={onDeleteGlobalSource}
        />
      );
    },
    [getGlobalSourceBalance]
  );

  return (
    <FlatList
      data={globalSources}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="px-md py-lg pb-[96] gap-md"
      ListEmptyComponent={GlobalSourceListEmpty}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
}

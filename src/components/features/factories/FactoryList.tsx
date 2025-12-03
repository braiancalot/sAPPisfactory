import { useCallback } from "react";
import { FlatList } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";

import FactoryCard from "@features/factories/FactoryCard";
import FactoryListEmpty from "@features/factories/FactoryListEmpty";

type ExternalProps = {
  onNavigateToFactory: (factory: Factory) => void;
  onDeleteFactory: (factory: Factory) => void;
};

type Props = ExternalProps & {
  factories: Factory[];
};

function FactoryList({
  factories,
  onNavigateToFactory,
  onDeleteFactory,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Factory }) => (
      <FactoryCard
        factory={item}
        onNavigate={onNavigateToFactory}
        onDelete={onDeleteFactory}
      />
    ),
    []
  );

  return (
    <FlatList
      data={factories}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="px-md py-lg pb-[96] gap-md"
      ListEmptyComponent={FactoryListEmpty}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
}

const enhance = withObservables([], () => ({
  factories: factoriesCollection.query(),
}));

export default enhance(FactoryList) as React.ComponentType<ExternalProps>;

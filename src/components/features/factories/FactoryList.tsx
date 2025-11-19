import { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";
import { withObservables } from "@nozbe/watermelondb/react";

import FactoryCard from "@features/factories/FactoryCard";
import FactoryListEmpty from "@features/factories/FactoryListEmpty";

import { FlatList } from "react-native";

type Props = {
  factories: Factory[];
  onNavigateToFactory: (factory: Factory) => void;
  onDeleteFactory: (factory: Factory) => void;
};

function FactoryList({
  factories,
  onNavigateToFactory,
  onDeleteFactory,
}: Props) {
  return (
    <FlatList
      data={factories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FactoryCard
          factory={item}
          onNavigate={onNavigateToFactory}
          onDelete={onDeleteFactory}
        />
      )}
      contentContainerClassName="gap-md p-lg pb-[76]"
      ListEmptyComponent={FactoryListEmpty}
    />
  );
}

const enhance = withObservables([], () => ({
  factories: factoriesCollection.query(),
}));

export default enhance(FactoryList);

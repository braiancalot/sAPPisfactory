import { useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";

import { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";

import { updatePositions } from "@services/reorderService";

import FactoryCard from "@features/factories/FactoryCard";
import FactoryListEmpty from "@features/factories/FactoryListEmpty";

type ExternalProps = {
  onNavigateToFactory: (factory: Factory) => void;
  onDeleteFactory: (factory: Factory) => void;
  isReordering?: boolean;
  onReorderEnd?: () => void;
};

type Props = ExternalProps & {
  factories: Factory[];
};

function FactoryList({
  factories,
  onNavigateToFactory,
  onDeleteFactory,
  isReordering = false,
  onReorderEnd,
}: Props) {
  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Factory>) => (
      <ScaleDecorator>
        <FactoryCard
          factory={item}
          onNavigate={onNavigateToFactory}
          onDelete={onDeleteFactory}
          onLongPress={drag}
          isActive={isActive}
          disableSwipe
        />
      </ScaleDecorator>
    ),
    [onNavigateToFactory, onDeleteFactory]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Factory>) => (
      <FactoryCard
        factory={item}
        onNavigate={onNavigateToFactory}
        onDelete={onDeleteFactory}
      />
    ),
    [onNavigateToFactory, onDeleteFactory]
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: Factory[] }) => {
      await updatePositions(data);
      onReorderEnd?.();
    },
    [onReorderEnd]
  );

  if (isReordering) {
    return (
      <DraggableFlatList
        data={factories}
        keyExtractor={(item) => item.id}
        renderItem={renderDraggableItem}
        onDragEnd={handleDragEnd}
        contentContainerClassName="px-md py-lg pb-[96]"
        ListEmptyComponent={FactoryListEmpty}
      />
    );
  }

  return (
    <FlatList
      data={factories}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="px-md py-lg pb-[96]"
      ListEmptyComponent={FactoryListEmpty}
    />
  );
}

const enhance = withObservables([], () => ({
  factories: factoriesCollection.query(Q.sortBy("position", Q.asc)),
}));

export default enhance(FactoryList) as React.ComponentType<ExternalProps>;

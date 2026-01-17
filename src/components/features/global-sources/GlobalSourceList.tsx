import { useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import GlobalSource from "@db/model/GlobalSource";

import { useGlobalBalance } from "@hooks/useGlobalBalance";
import { updatePositions } from "@services/reorderService";

import GlobalSourceCard from "@features/global-sources/GlobalSourceCard";
import GlobalSourceListEmpty from "@features/global-sources/GlobalSourceListEmpty";

type Props = {
  globalSources: GlobalSource[];
  onUpdateGlobalSource: (source: GlobalSource, newRate: number) => void;
  onDeleteGlobalSource: (source: GlobalSource) => void;
  isReordering?: boolean;
  onReorderEnd?: () => void;
};

export default function GlobalSourceList({
  globalSources,
  onUpdateGlobalSource,
  onDeleteGlobalSource,
  isReordering = false,
  onReorderEnd,
}: Props) {
  const { getGlobalSourceBalance } = useGlobalBalance();

  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<GlobalSource>) => {
      const balance = getGlobalSourceBalance(item.id);

      return (
        <ScaleDecorator>
          <GlobalSourceCard
            globalSource={item}
            balance={balance}
            onUpdate={onUpdateGlobalSource}
            onDelete={onDeleteGlobalSource}
            onLongPress={drag}
            isActive={isActive}
            disableSwipe
          />
        </ScaleDecorator>
      );
    },
    [getGlobalSourceBalance, onUpdateGlobalSource, onDeleteGlobalSource]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GlobalSource>) => {
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
    [getGlobalSourceBalance, onUpdateGlobalSource, onDeleteGlobalSource]
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: GlobalSource[] }) => {
      await updatePositions(data);
      onReorderEnd?.();
    },
    [onReorderEnd]
  );

  if (isReordering) {
    return (
      <DraggableFlatList
        data={globalSources}
        keyExtractor={(item) => item.id}
        renderItem={renderDraggableItem}
        onDragEnd={handleDragEnd}
        contentContainerClassName="px-md py-lg pb-[96]"
        ListEmptyComponent={GlobalSourceListEmpty}
      />
    );
  }

  return (
    <FlatList
      data={globalSources}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="px-md py-lg pb-[96]"
      ListEmptyComponent={GlobalSourceListEmpty}
    />
  );
}

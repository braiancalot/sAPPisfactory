import { useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";

import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";

import { useGlobalBalance } from "@hooks/useGlobalBalance";
import { updatePositions } from "@services/reorderService";

import ProductionLineCard from "./ProductionLineCard";
import ProductionLineEmpty from "./ProductionLineEmpty";

type ExternalProps = {
  factory: Factory;
  onNavigateToProductionLine: (productionLine: ProductionLine) => void;
  onDeleteProductionLine: (productionLine: ProductionLine) => void;
  isReordering?: boolean;
  onReorderEnd?: () => void;
};

type Props = ExternalProps & {
  productionLines: ProductionLine[];
};

function ProductionLineList({
  productionLines,
  onNavigateToProductionLine,
  onDeleteProductionLine,
  isReordering = false,
  onReorderEnd,
}: Props) {
  const { getProductionLineBalance } = useGlobalBalance();

  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ProductionLine>) => {
      const balance = getProductionLineBalance(item.id);

      return (
        <ScaleDecorator>
          <ProductionLineCard
            productionLine={item}
            balance={balance}
            onNavigate={onNavigateToProductionLine}
            onDelete={onDeleteProductionLine}
            onLongPress={drag}
            isActive={isActive}
            disableSwipe
          />
        </ScaleDecorator>
      );
    },
    [
      getProductionLineBalance,
      onNavigateToProductionLine,
      onDeleteProductionLine,
    ]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProductionLine>) => {
      const balance = getProductionLineBalance(item.id);

      return (
        <ProductionLineCard
          productionLine={item}
          balance={balance}
          onNavigate={onNavigateToProductionLine}
          onDelete={onDeleteProductionLine}
        />
      );
    },
    [
      getProductionLineBalance,
      onNavigateToProductionLine,
      onDeleteProductionLine,
    ]
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: ProductionLine[] }) => {
      await updatePositions(data);
      onReorderEnd?.();
    },
    [onReorderEnd]
  );

  if (isReordering) {
    return (
      <DraggableFlatList
        data={productionLines}
        keyExtractor={(item) => item.id}
        renderItem={renderDraggableItem}
        onDragEnd={handleDragEnd}
        contentContainerClassName="px-md py-lg pb-[96]"
        ListEmptyComponent={ProductionLineEmpty}
      />
    );
  }

  return (
    <FlatList
      data={productionLines}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="px-md py-lg pb-[96]"
      ListEmptyComponent={ProductionLineEmpty}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
}

const enhance = withObservables(["factory"], ({ factory }: ExternalProps) => ({
  productionLines: factory.productionLines.extend(Q.sortBy("position", Q.asc)),
}));

export default enhance(
  ProductionLineList
) as React.ComponentType<ExternalProps>;

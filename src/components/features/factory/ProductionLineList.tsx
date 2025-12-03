import { useCallback } from "react";
import { FlatList } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";

import ProductionLineCard from "./ProductionLineCard";
import ProductionLineEmpty from "./ProductionLineEmpty";

type ExternalProps = {
  factory: Factory;
  onNavigateToProductionLine: (productionLine: ProductionLine) => void;
  onDeleteProductionLine: (productionLine: ProductionLine) => void;
};

type Props = ExternalProps & {
  productionLines: ProductionLine[];
};

function ProductionLineList({
  productionLines,
  onNavigateToProductionLine,
  onDeleteProductionLine,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ProductionLine }) => (
      <ProductionLineCard
        productionLine={item}
        onNavigate={onNavigateToProductionLine}
        onDelete={onDeleteProductionLine}
      />
    ),
    []
  );

  return (
    <FlatList
      data={productionLines}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="px-md py-lg pb-[96] gap-md"
      ListEmptyComponent={ProductionLineEmpty}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
}

const enhance = withObservables(["factory"], ({ factory }: ExternalProps) => ({
  productionLines: factory.productionLines,
}));

export default enhance(
  ProductionLineList
) as React.ComponentType<ExternalProps>;

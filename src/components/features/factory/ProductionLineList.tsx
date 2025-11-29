import { productionLinesCollection } from "@db/index";
import { withObservables } from "@nozbe/watermelondb/react";
import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";

import ProductionLineCard from "./ProductionLineCard";
import ProductionLineEmpty from "./ProductionLineEmpty";

import { FlatList } from "react-native";

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
  return (
    <FlatList
      data={productionLines}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductionLineCard
          productionLine={item}
          onNavigate={onNavigateToProductionLine}
          onDelete={onDeleteProductionLine}
        />
      )}
      contentContainerClassName="px-md py-lg pb-[96] gap-md"
      ListEmptyComponent={ProductionLineEmpty}
    />
  );
}

const enhance = withObservables(["factory"], ({ factory }: ExternalProps) => ({
  productionLines: factory.productionLines,
}));

export default enhance(
  ProductionLineList
) as React.ComponentType<ExternalProps>;

import { useCallback } from "react";
import { FlatList } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import ScaleGroup from "@db/model/ScaleGroup";

import ScaleGroupEmpty from "./ScaleGroupEmpty";
import ScaleGroupRow from "./ScaleGroupRow";

type ExternalProps = {
  productionLine: ProductionLine;
};

type Props = ExternalProps & {
  scaleGroups: ScaleGroup[];
};

function ScaleGroupList({ scaleGroups }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ScaleGroup }) => <ScaleGroupRow scaleGroup={item} />,
    []
  );

  return (
    <FlatList
      data={scaleGroups}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="mt-lg gap-sm"
      ListEmptyComponent={ScaleGroupEmpty}
      scrollEnabled={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
  );
}

const enhance = withObservables(
  ["productionLine"],
  ({ productionLine }: ExternalProps) => ({
    scaleGroups: productionLine.scaleGroups,
  })
);

export default enhance(ScaleGroupList) as React.ComponentType<ExternalProps>;

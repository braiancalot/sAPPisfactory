import { FlatList } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";

import InputRow from "./InputRow";
import InputEmpty from "./InputEmpty";
import { useCallback } from "react";

type ExternalProps = {
  productionLine: ProductionLine;
  onInputAction: (input: ProductionLineInput) => void;
  onInputPress: (input: ProductionLineInput) => void;
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

function InputList({ inputs, onInputAction, onInputPress }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ProductionLineInput }) => (
      <InputRow input={item} onAction={onInputAction} onPress={onInputPress} />
    ),
    []
  );

  return (
    <FlatList
      data={inputs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="gap-sm"
      ListEmptyComponent={InputEmpty}
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
    inputs: productionLine.inputs,
  })
);

export default enhance(InputList) as React.ComponentType<ExternalProps>;

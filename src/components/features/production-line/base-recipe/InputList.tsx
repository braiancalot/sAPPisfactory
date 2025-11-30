import { FlatList } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";

import InputRow from "./InputRow";
import InputEmpty from "./InputEmpty";

type ExternalProps = {
  productionLine: ProductionLine;
  onInputAction: (input: ProductionLineInput) => void;
  onInputPress: (input: ProductionLineInput) => void;
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

function InputList({ inputs, onInputAction, onInputPress }: Props) {
  return (
    <FlatList
      data={inputs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <InputRow
          input={item}
          onAction={onInputAction}
          onPress={onInputPress}
        />
      )}
      contentContainerClassName="gap-sm"
      ListEmptyComponent={InputEmpty}
      scrollEnabled={false}
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

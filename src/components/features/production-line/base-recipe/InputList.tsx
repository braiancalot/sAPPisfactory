import { FlatList } from "react-native";

import ProductionLineInput from "@db/model/ProductionLineInput";

import InputRow from "./InputRow";
import InputEmpty from "./InputEmpty";
import { useCallback } from "react";

type Props = {
  inputs: ProductionLineInput[];
  onInputAction: (input: ProductionLineInput) => void;
  onInputPress: (input: ProductionLineInput) => void;
};

export default function InputList({
  inputs,
  onInputAction,
  onInputPress,
}: Props) {
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

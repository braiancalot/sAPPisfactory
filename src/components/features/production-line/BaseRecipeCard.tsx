import { useEffect, useState } from "react";
import { View } from "react-native";

import { useBottomSheetModal } from "@gorhom/bottom-sheet";

import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import { getItemData, ItemId } from "@data/item";

import Card from "@ui/Card";
import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";

import Button from "@ui/Button";
import AddInputModal from "./AddInputModal";
import { addProductionLineInput } from "src/services/productionLineService";
import { withObservables } from "@nozbe/watermelondb/react";

type InputRowProps = {
  input: ProductionLineInput;
};

function InputRow({ input }: InputRowProps) {
  const itemData = getItemData(input.inputItem);

  return (
    <View className="flex-row items-center justify-between gap-md py-sm pl-xs border-b border-border">
      <View className="flex-row items-center gap-xl flex-1">
        <Item icon={itemData.icon} size="md" />

        <Text
          variant="body"
          className="text-text-secondary flex-wrap flex-1"
          numberOfLines={2}
        >
          {itemData.name}
        </Text>
      </View>

      <RateDisplay value={-input.inputBaseRate} size="sm" />
    </View>
  );
}

type ExternalProps = {
  productionLine: ProductionLine;
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

function BaseRecipeCard({ productionLine, inputs }: Props) {
  const [addInputModalVisible, setAddInputModalVisible] = useState(false);
  //   const { dismissAll } = useBottomSheetModal();

  const outputItemData = getItemData(productionLine.outputItem);

  function handleOpenAddModal() {
    setAddInputModalVisible(true);
  }

  function handleCloseAddModal() {
    setAddInputModalVisible(false);
  }

  async function handleAddInput(item: ItemId, rate: number) {
    await addProductionLineInput(productionLine, item, rate);
  }

  async function handleUpdateRate(newRate: number) {
    // await productionLine.updateOutputBaseRate(newRate);
    // dismissAll();
  }

  return (
    <>
      <Card>
        <View className="flex-row items-center justify-between pb-sm">
          <Text variant="title" className="text-text-primary">
            Receita base
          </Text>
        </View>

        <View className="mt-md flex-row items-center gap-md justify-between">
          <View className="flex-row items-center gap-lg flex-1">
            <Item icon={outputItemData.icon} size="lg" />

            <Text
              variant="subhead"
              className="text-text-primary flex-wrap flex-1"
              numberOfLines={2}
            >
              {outputItemData.name}
            </Text>
          </View>

          <RateDisplay value={productionLine.outputBaseRate} size="md" />
        </View>

        <View className="mt-sm border-t border-border">
          {inputs.map((input) => (
            <InputRow key={input.id} input={input} />
          ))}
        </View>

        <View className="pt-md">
          <Button
            variant="ghost"
            title="Adicionar ingrediente"
            onPress={handleOpenAddModal}
          />
        </View>
      </Card>

      <AddInputModal
        visible={addInputModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAddInput}
      />
    </>
  );
}

const enhance = withObservables(["productionLine"], ({ productionLine }) => ({
  productionLine,
  inputs: productionLine.inputs,
}));

export default enhance(BaseRecipeCard) as React.ComponentType<ExternalProps>;

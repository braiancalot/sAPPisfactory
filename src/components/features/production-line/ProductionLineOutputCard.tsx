import { View } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";
import ProductionLine from "@db/model/ProductionLine";

import { getItemData } from "@data/item";

import Item from "@ui/Item";
import RateDisplay from "@ui/RateDisplay";
import Text from "@ui/Text";
import PressableCard from "@ui/PressableCard";
import { useState } from "react";
import { parsePtBrNumber, sanitizeNumericInput } from "src/utils/numberFormat";
import Input from "@ui/Input";
import { typography } from "src/utils/typography";

type Props = {
  productionLine: ProductionLine;
};

function ProductionLineOutputCard({ productionLine }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const outputItem = getItemData(productionLine.outputItem);

  function handlePress() {
    setEditValue(
      sanitizeNumericInput(productionLine.outputBaseRate.toString())
    );
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleSave() {
    setIsEditing(false);
    const newRate = parsePtBrNumber(editValue);
    await productionLine.updateOutputBaseRate(newRate);
  }

  return (
    <PressableCard onPress={handlePress}>
      <View className="flex-row items-center gap-md">
        <View className="flex-row items-center gap-lg flex-1">
          <Item icon={outputItem.icon} size="lg" />

          <Text
            variant="subhead"
            className="text-text-primary flex-wrap flex-1"
            numberOfLines={2}
          >
            {outputItem.name}
          </Text>
        </View>

        {isEditing ? (
          <View className="flex-row items-end gap-2xs">
            <Input
              value={editValue}
              onChangeValue={setEditValue}
              onSubmit={handleSave}
              onBlur={handleCancelEdit}
              autoFocus
              numeric
              variant="borderless"
              className="border-b-2 border-secondary min-w-[12] max-w-[100px] mb-[-2px] text-right text-secondary p-0 h-[25px]"
              style={[typography.numberMd, { paddingVertical: 0 }]}
            />

            <Text variant="caption" className="text-text-tertiary mb-[1.5px]">
              /min
            </Text>
          </View>
        ) : (
          <View className="h-[25px] justify-center">
            <RateDisplay value={productionLine.outputBaseRate} size="md" />
          </View>
        )}
      </View>
    </PressableCard>
  );
}

const enhance = withObservables(["productionLine"], ({ productionLine }) => ({
  productionLine,
}));

export default enhance(ProductionLineOutputCard) as React.ComponentType<Props>;

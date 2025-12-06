import { View } from "react-native";

import ProductionLine from "@db/model/ProductionLine";

import { addScaleGroup } from "@services/scaleGroupService";

import Card from "@ui/Card";
import Text from "@ui/Text";
import Button from "@ui/Button";
import ScaleGroupList from "./ScaleGroupList";

type Props = {
  productionLine: ProductionLine;
};

export default function ScaleGroupCard({ productionLine }: Props) {
  async function handleAddGroup() {
    await addScaleGroup(productionLine);
  }

  return (
    <Card className="p-md">
      <View className="flex-row items-center justify-between px-xs">
        <Text variant="title" className="text-text-secondary">
          Escala
        </Text>
      </View>

      <ScaleGroupList productionLine={productionLine} />

      <View className="mt-xs w-full">
        <Button
          variant="ghost"
          title="Adicionar grupo"
          icon="add"
          size="sm"
          onPress={handleAddGroup}
        />
      </View>
    </Card>
  );
}

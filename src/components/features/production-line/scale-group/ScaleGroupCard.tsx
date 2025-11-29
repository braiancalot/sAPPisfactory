import Animated, { LayoutAnimationConfig } from "react-native-reanimated";

import { withObservables } from "@nozbe/watermelondb/react";

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

function ScaleGroupCard({ productionLine }: Props) {
  async function handleAddGroup() {
    await addScaleGroup(productionLine);
  }

  return (
    <LayoutAnimationConfig skipEntering>
      <Card className="p-md">
        <View className="flex-row items-center justify-between px-xs">
          <Text variant="title" className="text-text-secondary">
            Escala de Produção
          </Text>
        </View>

        <ScaleGroupList productionLine={productionLine} />

        <Animated.View className="mt-xs w-full">
          <Button
            variant="ghost"
            title="Adicionar grupo de máquinas"
            icon="add"
            size="sm"
            onPress={handleAddGroup}
          />
        </Animated.View>
      </Card>
    </LayoutAnimationConfig>
  );
}

const enhance = withObservables(
  ["productionLine"],
  ({ productionLine }: Props) => ({
    productionLine,
  })
);

export default enhance(ScaleGroupCard) as React.ComponentType<Props>;

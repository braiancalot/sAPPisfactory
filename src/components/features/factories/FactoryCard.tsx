import { View } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import Factory from "@db/model/Factory";
import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import { getItemData } from "@data/item";

import Text from "@ui/Text";
import Item from "@ui/Item";
import SwipeableCard from "@ui/SwipeableCard";
import { useGlobalBalance } from "@hooks/useGlobalBalance";

type ExternalProps = {
  factory: Factory;
  onNavigate: (factory: Factory) => void;
  onDelete: (factory: Factory) => void;
  onLongPress?: () => void;
  isActive?: boolean;
  disableSwipe?: boolean;
};

type Props = ExternalProps & {
  productionLines: ProductionLine[];
};

function FactoryCard({
  factory,
  productionLines,
  onNavigate,
  onDelete,
  onLongPress,
  disableSwipe = false,
}: Props) {
  function handlePress() {
    onNavigate(factory);
  }

  function handleDelete() {
    onDelete(factory);
  }

  return (
    <SwipeableCard
      onPress={handlePress}
      onLongPress={onLongPress}
      onDelete={handleDelete}
      shouldResetOnAction
      disableSwipe={disableSwipe}
      disablePress={disableSwipe}
      className="p-md rounded-lg mb-md"
    >
      <View className="flex-row items-end justify-between gap-md">
        <View className="flex-1">
          <Text
            variant="subhead"
            className="text-text-primary flex-wrap"
            numberOfLines={1}
          >
            {factory.name}
          </Text>
        </View>

        <View className="flex-row gap-xs">
          {productionLines.map((productionLine) => (
            <ProductionLineStatusEnhanced
              key={productionLine.id}
              productionLine={productionLine}
            />
          ))}
        </View>
      </View>
    </SwipeableCard>
  );
}

const enhance = withObservables(["factory"], ({ factory }) => ({
  factory: factory,
  productionLines: factory.productionLines,
}));

export default enhance(FactoryCard) as React.ComponentType<ExternalProps>;

type StatusProps = {
  productionLine: ProductionLine;
  inputs: ProductionLineInput[];
};

const ProductionLineStatus = ({ productionLine, inputs }: StatusProps) => {
  const { getProductionLineBalance } = useGlobalBalance();

  const balance = getProductionLineBalance(productionLine.id);
  const danger = balance?.balance !== undefined && balance.balance < 0;

  const warning = inputs.some((input) => !input.sourceType);

  const dotColor = danger
    ? "bg-danger"
    : warning
      ? "bg-warning"
      : "bg-transparent";

  return (
    <View className="relative">
      <Item icon={getItemData(productionLine.outputItem).icon} size="sm" />
      <View
        className={`rounded-full h-[4px] w-[4px] absolute right-0 top-0 ${dotColor}`}
      />
    </View>
  );
};

const enhanceStatus = withObservables(
  ["productionLine"],
  ({ productionLine }) => ({
    productionLine,
    inputs: productionLine.inputs,
  })
);

const ProductionLineStatusEnhanced = enhanceStatus(ProductionLineStatus);

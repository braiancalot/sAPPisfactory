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
import { Q } from "@nozbe/watermelondb";

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
  const { getProductionLineBalance } = useGlobalBalance();

  function handlePress() {
    onNavigate(factory);
  }

  function handleDelete() {
    onDelete(factory);
  }

  const sortedLines = [...productionLines].sort((a, b) => {
    const balanceA = getProductionLineBalance(a.id)?.balance;
    const balanceB = getProductionLineBalance(b.id)?.balance;

    const isDangerA = balanceA !== undefined && balanceA < 0;
    const isDangerB = balanceB !== undefined && balanceB < 0;

    if (isDangerA && !isDangerB) return -1;
    if (!isDangerA && isDangerB) return 1;

    return 0;
  });

  const VISIBLE_LIMIT = 4;
  const visibleItems = sortedLines.slice(0, VISIBLE_LIMIT);
  const remainingCount = productionLines.length - VISIBLE_LIMIT;

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

        <View className="flex-row gap-xs items-center">
          {visibleItems.map((productionLine) => (
            <ProductionLineStatusEnhanced
              key={productionLine.id}
              productionLine={productionLine}
            />
          ))}

          {remainingCount > 0 && (
            <Text variant="caption" className="text-text-secondary font-medium">
              + {remainingCount}
            </Text>
          )}
        </View>
      </View>
    </SwipeableCard>
  );
}

const enhance = withObservables(["factory"], ({ factory }) => ({
  factory: factory,
  productionLines: factory.productionLines
    .extend(Q.sortBy("position", Q.desc))
    .observe(),
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

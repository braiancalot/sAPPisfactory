import { View } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import ProductionLine from "@db/model/ProductionLine";
import ProductionLineInput from "@db/model/ProductionLineInput";
import { getItemData } from "@data/item";

import { ProductionLineBalance } from "@services/global-balance/globalBalance.types";

import RateDisplay from "@ui/RateDisplay";
import Item from "@ui/Item";
import Text from "@ui/Text";
import SwipeableCard from "@ui/SwipeableCard";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type ExternalProps = {
  productionLine: ProductionLine;
  balance: ProductionLineBalance | undefined;
  onNavigate: (productionLine: ProductionLine) => void;
  onDelete: (productionLine: ProductionLine) => void;
  onLongPress?: () => void;
  isActive?: boolean;
  disableSwipe?: boolean;
};

type Props = ExternalProps & {
  inputs: ProductionLineInput[];
};

function ProductionLineCard({
  productionLine,
  inputs,
  balance,
  onNavigate,
  onDelete,
  onLongPress,
  disableSwipe = false,
}: Props) {
  const itemData = getItemData(productionLine.outputItem);

  const warning = inputs.some((input) => !input.sourceType);

  function handlePress() {
    onNavigate(productionLine);
  }

  function handleDelete() {
    onDelete(productionLine);
  }

  return (
    <SwipeableCard
      onPress={handlePress}
      onDelete={handleDelete}
      onLongPress={onLongPress}
      disableSwipe={disableSwipe}
      disablePress={disableSwipe}
      shouldResetOnAction
      className={`p-md rounded-lg border ${warning ? "border-warning" : "border-transparent"} mb-md`}
    >
      <View className="flex-row items-center justify-between gap-md">
        <View className="flex-row items-center gap-lg flex-1">
          <Item icon={itemData.icon} size="md" />

          <View className="gap-2xs items-start flex-1">
            <View className="flex-row items-center gap-xs">
              <Text
                variant="subhead"
                className="text-text-primary flex-wrap"
                numberOfLines={1}
              >
                {itemData.name}
              </Text>

              {warning && (
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={colors.warning}
                />
              )}
            </View>

            <View className="h-[19]">
              <RateDisplay
                value={balance?.production ?? 0}
                size="sm"
                colored={false}
              />
            </View>
          </View>
        </View>

        <View className="max-w-40">
          <RateDisplay value={balance?.balance ?? 0} size="md" />
        </View>
      </View>
    </SwipeableCard>
  );
}

const enhance = withObservables(["productionLine"], ({ productionLine }) => ({
  productionLine,
  inputs: productionLine.inputs,
}));

export default enhance(
  ProductionLineCard
) as React.ComponentType<ExternalProps>;

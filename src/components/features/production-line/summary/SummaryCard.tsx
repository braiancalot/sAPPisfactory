import { View } from "react-native";

import ProductionLine from "@db/model/ProductionLine";
import { getItemData } from "@data/item";

import Card from "@ui/Card";
import Item from "@ui/Item";
import Text from "@ui/Text";
import RateDisplay from "@ui/RateDisplay";

import InputConsumptionList from "@features/production-line/summary/InputConsumptionList";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";

type ResourceBalanceProps = {
  production: number;
  consumption: number;
};

function ResourceBalance({ production, consumption }: ResourceBalanceProps) {
  const netBalance = production - consumption;

  const isPositive = netBalance > 0;
  const isNegative = netBalance < 0;

  let iconName: keyof typeof MaterialIcons.glyphMap = "check-circle";
  let iconColor = colors["text-tertiary"];

  if (isPositive) {
    iconName = "add-circle";
    iconColor = colors.success;
  } else if (isNegative) {
    iconName = "warning";
    iconColor = colors.danger;
  }

  return (
    <View className="mt-lg px-xs">
      <Text variant="caption" className="text-text-tertiary uppercase">
        Balanço Global
      </Text>

      <View className="bg-surface-2 rounded-md mt-xs overflow-hidden">
        <View className="p-md gap-xs">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-xs">
              <MaterialIcons
                name="arrow-upward"
                size={16}
                color={colors.success}
              />
              <Text variant="footnote" className="text-text-tertiary">
                Produção
              </Text>
            </View>
            <RateDisplay value={production} size="sm" colored={false} />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-xs">
              <MaterialIcons
                name="arrow-downward"
                size={16}
                color={colors.danger}
              />
              <Text variant="footnote" className="text-text-tertiary">
                Consumo
              </Text>
            </View>
            <RateDisplay value={-consumption} size="sm" colored={false} />
          </View>
        </View>

        <View className="border-t border-border p-md flex-row items-center justify-between bg-surface-2">
          <View className="flex-row items-center gap-xs flex-1">
            <MaterialIcons name={iconName} size={16} color={iconColor} />
            <Text variant="body" className="text-white font-bold uppercase">
              Saldo Global
            </Text>
          </View>

          <RateDisplay value={netBalance} size="lg" colored={true} />
        </View>
      </View>
    </View>
  );
}

type Props = {
  productionLine: ProductionLine;
};

export default function SummaryCard({ productionLine }: Props) {
  const outputItem = getItemData(productionLine.outputItem);

  const productionRate = productionLine.outputBaseRate;
  const consumptionRate = productionLine.outputBaseRate * 0.8; // Placeholder

  return (
    <Card className="p-md">
      <View className="flex-row items-center justify-between px-xs">
        <Text variant="title" className="text-text-secondary">
          Sumário
        </Text>
      </View>

      <View className="mt-lg px-xs">
        <Text variant="caption" className="text-text-tertiary uppercase">
          Produção Total
        </Text>

        <View className="p-sm bg-surface-2 rounded-md mt-xs">
          <View className="flex-row items-center gap-md">
            <Item icon={outputItem.icon} size="md" />

            <Text
              variant="body"
              className="text-text-secondary flex-1"
              numberOfLines={1}
            >
              {outputItem.name}
            </Text>

            <RateDisplay
              value={productionLine.outputBaseRate}
              size="md"
              colored={false}
            />
          </View>
        </View>
      </View>

      <View className="mt-lg px-xs">
        <Text variant="caption" className="text-text-tertiary uppercase">
          Consumo Total
        </Text>

        <InputConsumptionList productionLine={productionLine} />
      </View>

      <ResourceBalance
        production={productionRate}
        consumption={consumptionRate}
      />
    </Card>
  );
}

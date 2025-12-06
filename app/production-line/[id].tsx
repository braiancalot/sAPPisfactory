import { useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import { switchMap } from "@nozbe/watermelondb/utils/rx";
import { withObservables } from "@nozbe/watermelondb/react";

import { productionLinesCollection } from "@db/index";
import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";
import { getItemData } from "@data/item";

import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";
import { MenuItem } from "@ui/MenuSheet";
import ContextMenu from "@ui/ContextMenu";
import ScrollScreenContainer from "@ui/ScrollScreenContainer";

import BaseRecipeCard from "@features/production-line/base-recipe/BaseRecipeCard";
import ScaleGroupCard from "@features/production-line/scale-group/ScaleGroupCard";
import SummaryCard from "@features/production-line/summary/SummaryCard";

import { colors } from "@theme/colors";
import { useGlobalBalances } from "@hooks/useGlobalBalances";

type ProductionLineDetailsProps = {
  productionLine: ProductionLine;
  factory: Factory;
};

function ProductionLineDetails({
  productionLine,
  factory,
}: ProductionLineDetailsProps) {
  const { dismissAll } = useBottomSheetModal();

  const confirmProductionLineDeletionSheetRef = useRef<BottomSheetModal>(null);

  const outputItemData = getItemData(productionLine.outputItem);

  const factoryName = factory?.name || "Carregando fábrica...";
  const itemName = outputItemData.name || "Carregando item...";

  const headerTitle = `${factoryName} / ${itemName}`;

  function handleDeleteProductionLineRequest() {
    dismissAll();
    setTimeout(
      () => confirmProductionLineDeletionSheetRef.current?.present(),
      100
    );
  }

  function handleCancelAll() {
    dismissAll();
  }

  async function handleConfirmProductionLineDeletion() {
    await productionLine.delete();

    dismissAll();
    router.back();
  }

  const menuOptions: MenuItem[] = [
    {
      label: "Excluir",
      onPress: handleDeleteProductionLineRequest,
      icon: "delete",
      isDestructive: true,
    },
  ];

  return (
    <ScrollScreenContainer>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerRight: () => <ContextMenu options={menuOptions} />,
        }}
      />

      <View className="px-md py-lg gap-xl">
        <SummaryCard productionLine={productionLine} />
        <ScaleGroupCard productionLine={productionLine} />
        <BaseRecipeCard productionLine={productionLine} />
      </View>

      <ConfirmDialog
        ref={confirmProductionLineDeletionSheetRef}
        title="Remover linha de produção?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja remover a linha de produção de{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {outputItemData.name}
            </Text>
            ? Outras linhas de produção que usam esse recurso ficarão sem
            suprimento.
          </Text>
        }
        onCancel={handleCancelAll}
        onConfirm={handleConfirmProductionLineDeletion}
        confirmText="Remover"
      />
    </ScrollScreenContainer>
  );
}

const enhance = withObservables(
  ["productionLineId"],
  ({ productionLineId }) => {
    const productionLineObservable =
      productionLinesCollection.findAndObserve(productionLineId);

    return {
      productionLine: productionLineObservable,
      factory: productionLineObservable.pipe(
        switchMap((line) => line.factory.fetch())
      ),
    };
  }
);

const EnhancedProductionLineDetails = enhance(ProductionLineDetails);

export default function ProductionLineScreen() {
  const { id } = useLocalSearchParams();

  const productionLineId = Array.isArray(id) ? id[0] : id;

  if (!productionLineId)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return <EnhancedProductionLineDetails productionLineId={productionLineId} />;
}

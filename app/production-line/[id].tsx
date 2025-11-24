import { useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import { withObservables } from "@nozbe/watermelondb/react";
import { productionLinesCollection } from "@db/index";
import ProductionLine from "@db/model/ProductionLine";
import Factory from "@db/model/Factory";
import { getItemData } from "@data/item";

import ScreenContainer from "@ui/ScreenContainer";
import ContextMenu, { MenuItem } from "@ui/ContextMenu";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";
import EditProductionLineSheet from "@features/production-line/EditProductionLineSheet";

import { colors } from "@theme/colors";

type ProductionLineDetailsProps = {
  productionLine: ProductionLine;
  factory: Factory;
};

function ProductionLineDetails({
  productionLine,
  factory,
}: ProductionLineDetailsProps) {
  const { dismissAll } = useBottomSheetModal();

  const editSheetRef = useRef<BottomSheetModal>(null);
  const confirmProductionLineDeletionSheetRef = useRef<BottomSheetModal>(null);

  const outputItemData = getItemData(productionLine.outputItem);

  const factoryName = factory?.name || "Carregando fábrica...";
  const itemName = outputItemData.name || "Carregando item...";

  const headerTitle = `${factoryName} / ${itemName}`;

  function handleOpenEditSheet() {
    dismissAll();
    setTimeout(() => editSheetRef.current?.present(), 100);
  }

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

  async function handleUpdateRate(newRate: number) {
    await productionLine.updateOutputBaseRate(newRate);

    dismissAll();
  }

  async function handleConfirmFactoryDeletion() {
    await productionLine.delete();

    dismissAll();
    router.back();
  }

  const menuOptions: MenuItem[] = [
    {
      label: "Editar",
      onPress: handleOpenEditSheet,
      icon: "edit",
    },
    {
      label: "Excluir",
      onPress: handleDeleteProductionLineRequest,
      icon: "delete",
    },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: headerTitle,
          headerRight: () => <ContextMenu options={menuOptions} />,
        }}
      />

      <EditProductionLineSheet
        ref={editSheetRef}
        productionLine={productionLine}
        onCancel={handleCancelAll}
        onConfirm={handleUpdateRate}
      />

      <ConfirmDialog
        ref={confirmProductionLineDeletionSheetRef}
        title="Remover fábrica?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja remover a linha de produção{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {outputItemData.name}
            </Text>
            ? Outras linhas de produção que usam esse recurso ficarão sem
            suprimento.
          </Text>
        }
        onCancel={handleCancelAll}
        onConfirm={handleConfirmFactoryDeletion}
        confirmText="Remover"
      />
    </ScreenContainer>
  );
}

const enhanceLine = withObservables(
  ["productionLineId"],
  ({ productionLineId }) => ({
    productionLine: productionLinesCollection.findAndObserve(productionLineId),
  })
);

const enhanceWithFactory = withObservables(
  ["productionLine"],
  ({ productionLine }) => ({
    factory: productionLine.factory,
  })
);

const EnhancedProductionLineDetails = enhanceLine(
  enhanceWithFactory(ProductionLineDetails)
);

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

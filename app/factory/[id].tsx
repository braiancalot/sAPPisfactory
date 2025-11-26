import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import { withObservables } from "@nozbe/watermelondb/react";
import { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";
import ProductionLine from "@db/model/ProductionLine";

import { getItemData, ItemId } from "@data/item";
import { addProductionLine } from "@services/productionLineService";

import ScreenContainer from "@ui/ScreenContainer";
import ContextMenu from "@ui/ContextMenu";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";
import FAB from "@ui/FAB";
import EditFactorySheet from "@features/factory/EditFactorySheet";
import AddProductionLineModal from "@features/factory/AddProductionLineModal";
import ProductionLineList from "@features/factory/ProductionLineList";

import { colors } from "@theme/colors";
import { MenuItem } from "@ui/MenuSheet";

type FactoryDetailsProps = {
  factory: Factory;
};

function FactoryDetails({ factory }: FactoryDetailsProps) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const { dismissAll } = useBottomSheetModal();
  const [productionLineToDelete, setProductionLineToDelete] =
    useState<ProductionLine | null>(null);

  const editSheetRef = useRef<BottomSheetModal>(null);
  const confirmFactoryDeletionSheetRef = useRef<BottomSheetModal>(null);
  const confirmProductionLineDeletionSheetRef = useRef<BottomSheetModal>(null);

  function handleOpenAddModal() {
    setAddModalVisible(true);
  }

  function handleCloseAddModal() {
    setAddModalVisible(false);
  }

  function handleOpenEditSheet() {
    dismissAll();
    setTimeout(() => editSheetRef.current?.present(), 100);
  }

  function handleDeleteFactoryRequest() {
    dismissAll();
    setTimeout(() => confirmFactoryDeletionSheetRef.current?.present(), 100);
  }

  function handleDeleteProductionLineRequest(productionLine: ProductionLine) {
    setProductionLineToDelete(productionLine);
    confirmProductionLineDeletionSheetRef.current?.present();
  }

  function handleCancelAll() {
    dismissAll();
  }

  function handleCancelProductionLineDeletion() {
    setProductionLineToDelete(null);
    confirmProductionLineDeletionSheetRef.current?.dismiss();
  }

  async function handleAdd(item: ItemId, rate: number) {
    await addProductionLine(factory, item, rate);
  }

  async function handleUpdateName(newName: string) {
    await factory.updateName(newName);

    dismissAll();
  }

  async function handleConfirmFactoryDeletion() {
    await factory.delete();

    dismissAll();
    router.back();
  }

  async function handleConfirmProductionLineDeletion() {
    if (!productionLineToDelete) return;

    await productionLineToDelete.delete();
    setProductionLineToDelete(null);
    confirmProductionLineDeletionSheetRef.current?.dismiss();
  }

  function handleNavigateToProductionLine(productionLine: ProductionLine) {
    router.push(`production-line/${productionLine.id}`);
  }

  const menuOptions: MenuItem[] = [
    {
      label: "Editar",
      onPress: handleOpenEditSheet,
      icon: "edit",
    },
    {
      label: "Excluir",
      onPress: handleDeleteFactoryRequest,
      icon: "delete",
      isDestructive: true,
    },
  ];

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          title: factory?.name || "Carregando...",
          headerRight: () => <ContextMenu options={menuOptions} />,
        }}
      />

      <ProductionLineList
        factory={factory}
        onNavigateToProductionLine={handleNavigateToProductionLine}
        onDeleteProductionLine={handleDeleteProductionLineRequest}
      />

      <FAB onPress={handleOpenAddModal} />

      <AddProductionLineModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
      />

      <EditFactorySheet
        ref={editSheetRef}
        factory={factory}
        onCancel={handleCancelAll}
        onConfirm={handleUpdateName}
      />

      <ConfirmDialog
        ref={confirmFactoryDeletionSheetRef}
        title="Remover fábrica?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja deletar a fábrica{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {factory?.name}
            </Text>
            ? Todas as linhas de produção contidas nela serão{" "}
            <Text variant="bodyHighlight">perdidas permanentemente</Text>.
          </Text>
        }
        onCancel={handleCancelAll}
        onConfirm={handleConfirmFactoryDeletion}
        confirmText="Remover"
      />

      <ConfirmDialog
        ref={confirmProductionLineDeletionSheetRef}
        title="Remover linha de produção?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja remover a linha de produção{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {productionLineToDelete
                ? getItemData(productionLineToDelete.outputItem).name
                : ""}
            </Text>
            ? Outras linhas de produção que usam esse recurso ficarão sem
            suprimento.
          </Text>
        }
        onConfirm={handleConfirmProductionLineDeletion}
        onCancel={handleCancelProductionLineDeletion}
        confirmText="Remover"
      />
    </ScreenContainer>
  );
}

const enhance = withObservables(["factoryId"], ({ factoryId }) => ({
  factory: factoriesCollection.findAndObserve(factoryId),
}));

const EnhancedFactoryDetails = enhance(FactoryDetails);

export default function FactoryScreen() {
  const { id } = useLocalSearchParams();

  const factoryId = Array.isArray(id) ? id[0] : id;

  if (!factoryId)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return <EnhancedFactoryDetails factoryId={factoryId} />;
}

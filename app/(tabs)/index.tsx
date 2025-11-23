import { useRef, useState } from "react";
import { router } from "expo-router";

import database, { factoriesCollection } from "@db/index";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ScreenContainer from "@ui/ScreenContainer";
import FAB from "@ui/FAB";

import AddFactoryModal from "@features/factories/AddFactoryModal";
import FactoryList from "@features/factories/FactoryList";
import Factory from "@db/model/Factory";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";

export default function FactoriesScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [factoryToDelete, setFactoryToDelete] = useState<Factory | null>(null);

  const confirmSheetRef = useRef<BottomSheetModal>(null);

  function handleOpenAddModal() {
    setAddModalVisible(true);
  }

  function handleCloseAddModal() {
    setAddModalVisible(false);
  }

  async function handleAdd(name: string) {
    await database.write(async () => {
      await factoriesCollection.create((record) => {
        record.name = name;
      });
    });
  }

  function handleNavigateToFactory(factory: Factory) {
    router.push(`/factory/${factory.id}`);
  }

  function handleDeleteRequest(factory: Factory) {
    setFactoryToDelete(factory);
    confirmSheetRef.current?.present();
  }

  async function handleDelete() {
    if (!factoryToDelete) return;

    await factoryToDelete.delete();

    confirmSheetRef.current?.dismiss();
  }

  function handleCancelDelete() {
    setFactoryToDelete(null);
    confirmSheetRef.current?.dismiss();
  }

  return (
    <ScreenContainer>
      <FactoryList
        onNavigateToFactory={handleNavigateToFactory}
        onDeleteFactory={handleDeleteRequest}
      />

      <FAB onPress={handleOpenAddModal} />

      <AddFactoryModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
      />

      <ConfirmDialog
        ref={confirmSheetRef}
        title="Remover fábrica?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja deletar a fábrica{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {factoryToDelete?.name}
            </Text>
            ? Todas as linhas de produção contidas nela serão{" "}
            <Text variant="bodyHighlight">perdidas permanentemente</Text>.
          </Text>
        }
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
        confirmText="Remover"
      />
    </ScreenContainer>
  );
}

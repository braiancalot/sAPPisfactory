import { useState } from "react";

import database, { factoriesCollection } from "@db/index";

import ScreenContainer from "@ui/ScreenContainer";
import FAB from "@ui/FAB";

import AddFactoryModal from "@features/factories/AddFactoryModal";
import FactoryList from "@features/factories/FactoryList";
import Factory from "@db/model/Factory";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";
import { router } from "expo-router";

export default function FactoriesScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [factoryToDelete, setFactoryToDelete] = useState<Factory | null>(null);

  function handleOpenAddModal() {
    setAddModalVisible(true);
  }

  function handleCloseAddModal() {
    setAddModalVisible(false);
  }

  async function handleAdd(name: string) {
    await database.write(async () => {
      await factoriesCollection.create((factory) => {
        factory.name = name.trim();
      });
    });
  }

  function handleNavigateToFactory(factory: Factory) {
    router.navigate(`/factories/factory/${factory.id}`);
  }

  function handleDelete(factory: Factory) {
    setFactoryToDelete(factory);
    setDeleteConfirmationVisible(true);
  }

  async function handleConfirmDeletion() {
    if (!factoryToDelete) return;

    await database.write(async () => {
      await factoryToDelete.markAsDeleted();
    });

    setDeleteConfirmationVisible(false);
  }

  function handleCancelDelete() {
    setFactoryToDelete(null);
    setDeleteConfirmationVisible(false);
  }

  return (
    <ScreenContainer>
      <FactoryList
        onNavigateToFactory={handleNavigateToFactory}
        onDeleteFactory={handleDelete}
      />

      <FAB onPress={handleOpenAddModal} />

      <AddFactoryModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
      />

      <ConfirmDialog
        visible={deleteConfirmationVisible}
        title="Remover fábrica?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja deletar a fábrica{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {factoryToDelete?.name}
            </Text>
            ? Todas as linhas de produção contidas nela serão perdidas
            permanentemente{" "}
            <Text variant="bodyHighlight">perdidas permanentemente</Text>.
          </Text>
        }
        onConfirm={handleConfirmDeletion}
        onCancel={handleCancelDelete}
        confirmText="Remover"
      />
    </ScreenContainer>
  );
}

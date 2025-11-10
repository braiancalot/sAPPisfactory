import { useState } from "react";

import database, { globalSourcesCollection } from "@db/index";
import { ItemId } from "@data/item";

import ScreenContainer from "@ui/ScreenContainer";
import GlobalSourceList from "@features/global-source/GlobalSourceList";
import FAB from "@ui/FAB";
import AddGlobalSourceModal from "@features/global-source/AddGlobalSourceModal";
import GlobalSource from "@db/model/GlobalSource";
import ConfirmDialog from "@ui/ConfirmDialog";
import { parsePtBrNumber } from "src/utils/numberFormat";

export default function GlobalSourcesScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [globalSourceToDelete, setGlobalSourceToDelete] =
    useState<GlobalSource | null>(null);

  function handleOpenAddModal() {
    setAddModalVisible(true);
  }

  function handleCloseAddModal() {
    setAddModalVisible(false);
  }

  async function handleAdd(item: ItemId, rate: number) {
    await database.write(async () => {
      await globalSourcesCollection.create((globalSource) => {
        globalSource.item = item;
        globalSource.totalRatePerMin = rate;
      });
    });
  }

  async function handleUpdateRate(globalSource: GlobalSource, newRate: number) {
    await database.write(async () => {
      globalSource.update((globalSource) => {
        globalSource.totalRatePerMin = newRate;
      });
    });
  }

  function handleDelete(globalSource: GlobalSource) {
    setGlobalSourceToDelete(globalSource);
    setDeleteConfirmationVisible(true);
  }

  async function handleConfirmDeletion() {
    if (!globalSourceToDelete) return;

    await database.write(async () => {
      await globalSourceToDelete.markAsDeleted();
    });

    setDeleteConfirmationVisible(false);
  }

  function handleCancelDelete() {
    setGlobalSourceToDelete(null);
    setDeleteConfirmationVisible(false);
  }

  return (
    <ScreenContainer>
      <GlobalSourceList
        onUpdateGlobalSource={handleUpdateRate}
        onDeleteGlobalSource={handleDelete}
      />

      <FAB onPress={handleOpenAddModal} />

      <AddGlobalSourceModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
      />

      <ConfirmDialog
        visible={deleteConfirmationVisible}
        title="Excluir fonte global?"
        message="Tem certeza que deseja excluir a fonte?"
        onConfirm={handleConfirmDeletion}
        onCancel={handleCancelDelete}
      />
    </ScreenContainer>
  );
}

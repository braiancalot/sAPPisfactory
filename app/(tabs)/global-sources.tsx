import { useRef, useState } from "react";

import database, { globalSourcesCollection } from "@db/index";
import { getItemData, ItemId } from "@data/item";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ScreenContainer from "@ui/ScreenContainer";
import GlobalSourceList from "@features/global-source/GlobalSourceList";
import FAB from "@ui/FAB";
import AddGlobalSourceModal from "@features/global-source/AddGlobalSourceModal";
import GlobalSource from "@db/model/GlobalSource";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";

export default function GlobalSourcesScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [globalSourceToDelete, setGlobalSourceToDelete] =
    useState<GlobalSource | null>(null);

  const confirmSheetRef = useRef<BottomSheetModal>(null);

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

  function handleDeleteRequest(globalSource: GlobalSource) {
    setGlobalSourceToDelete(globalSource);
    confirmSheetRef.current?.present();
  }

  async function handleDelete() {
    if (!globalSourceToDelete) return;

    await database.write(async () => {
      await globalSourceToDelete.markAsDeleted();
    });

    confirmSheetRef.current?.dismiss();
  }

  function handleCancelDelete() {
    setGlobalSourceToDelete(null);
    confirmSheetRef.current?.dismiss();
  }

  const itemToDeleteData = globalSourceToDelete
    ? getItemData(globalSourceToDelete.item)
    : null;

  return (
    <ScreenContainer>
      <GlobalSourceList
        onUpdateGlobalSource={handleUpdateRate}
        onDeleteGlobalSource={handleDeleteRequest}
      />

      <FAB onPress={handleOpenAddModal} />

      <AddGlobalSourceModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
      />

      <ConfirmDialog
        ref={confirmSheetRef}
        title="Remover fonte global?"
        message={
          <Text variant="body" className="text-text-secondary">
            Tem certeza que deseja remover a fonte global{" "}
            <Text variant="bodyHighlight" className="text-secondary-light">
              {itemToDeleteData?.name}
            </Text>
            ? As linhas de produção que usam esse recurso ficarão sem
            suprimento.
          </Text>
        }
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
        confirmText="Remover"
      />
    </ScreenContainer>
  );
}

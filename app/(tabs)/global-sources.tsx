import { useRef, useState } from "react";

import GlobalSource from "@db/model/GlobalSource";
import { addGlobalSource } from "src/services/globalSourceService";
import { getItemData, ItemId } from "@data/item";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ScreenContainer from "@ui/ScreenContainer";
import FAB from "@ui/FAB";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";
import AddGlobalSourceModal from "@features/global-sources/AddGlobalSourceModal";
import GlobalSourceList from "@features/global-sources/GlobalSourceList";

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
    await addGlobalSource(item, rate);
  }

  async function handleUpdateRate(globalSource: GlobalSource, newRate: number) {
    await globalSource.updateRate(newRate);
  }

  function handleDeleteRequest(globalSource: GlobalSource) {
    setGlobalSourceToDelete(globalSource);
    confirmSheetRef.current?.present();
  }

  async function handleDelete() {
    if (!globalSourceToDelete) return;

    await globalSourceToDelete.delete();
    setGlobalSourceToDelete(null);
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

import { useRef, useState } from "react";
import { router } from "expo-router";

import Factory from "@db/model/Factory";
import { addFactory } from "@services/factoryService";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ScreenContainer from "@ui/ScreenContainer";
import FAB from "@ui/FAB";
import Text from "@ui/Text";
import ConfirmDialog from "@ui/ConfirmDialog";

import FactoryList from "@features/factories/FactoryList";
import AddFactorySheet from "@features/factories/AddFactorySheet";

export default function FactoriesScreen() {
  const [factoryToDelete, setFactoryToDelete] = useState<Factory | null>(null);

  const addSheetRef = useRef<BottomSheetModal>(null);
  const confirmSheetRef = useRef<BottomSheetModal>(null);

  function handleOpenAddSheet() {
    addSheetRef.current?.present();
  }

  async function handleAdd(name: string) {
    await addFactory(name);
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

      <FAB onPress={handleOpenAddSheet} />

      <AddFactorySheet ref={addSheetRef} onAdd={handleAdd} />

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

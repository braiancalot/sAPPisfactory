import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import database, { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";

import ScreenContainer from "@ui/ScreenContainer";
import ContextMenu, { MenuItem } from "@ui/ContextMenu";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";

import EditFactoryNameSheet from "@features/factory/EditFactoryNameSheet";

export default function FactoryScreen() {
  const { id } = useLocalSearchParams();
  const [factory, setFactory] = useState<Factory | null>(null);

  const { dismissAll } = useBottomSheetModal();

  const editSheetRef = useRef<BottomSheetModal>(null);
  const confirmSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const factoryId = Array.isArray(id) ? id[0] : id;
    if (!factoryId) return;

    async function getFactory() {
      const result = await factoriesCollection.find(factoryId);
      setFactory(result);
    }

    getFactory();
  }, [id]);

  function handleOpenEditSheet() {
    dismissAll();
    setTimeout(() => editSheetRef.current?.present(), 100);
  }

  function handleDeleteRequest() {
    dismissAll();
    setTimeout(() => confirmSheetRef.current?.present(), 100);
  }

  function handleCancelAll() {
    dismissAll();
  }

  async function handleUpdateName(newName: string) {
    if (!factory) return;

    await database.write(async () => {
      factory?.update((f) => {
        f.name = newName;
      });
    });

    dismissAll();
  }

  async function handleConfirmDeletion() {
    if (!factory) return;

    await database.write(async () => {
      await factory?.markAsDeleted();
    });

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
      onPress: handleDeleteRequest,
      icon: "delete",
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

      <EditFactoryNameSheet
        ref={editSheetRef}
        factory={factory}
        onCancel={handleCancelAll}
        onConfirm={handleUpdateName}
      />

      <ConfirmDialog
        ref={confirmSheetRef}
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
        onConfirm={handleConfirmDeletion}
        confirmText="Remover"
      />
    </ScreenContainer>
  );
}

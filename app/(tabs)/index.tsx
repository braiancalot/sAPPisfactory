import { useLayoutEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import Factory from "@db/model/Factory";
import { addFactory } from "@services/factoryService";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ScreenContainer from "@ui/ScreenContainer";
import FAB from "@ui/FAB";
import Text from "@ui/Text";
import ConfirmDialog from "@ui/ConfirmDialog";
import ContextMenu from "@ui/ContextMenu";
import { MenuItem } from "@ui/MenuSheet";

import { exportDatabaseAsJson } from "@services/exportService";

import FactoryList from "@features/factories/FactoryList";
import AddFactorySheet from "@features/factories/AddFactorySheet";

import { colors } from "@theme/colors";

export default function FactoriesScreen() {
  const [factoryToDelete, setFactoryToDelete] = useState<Factory | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const navigation = useNavigation();

  const addSheetRef = useRef<BottomSheetModal>(null);
  const confirmSheetRef = useRef<BottomSheetModal>(null);

  const menuOptions: MenuItem[] = [
    {
      label: "Exportar dados",
      icon: "file-upload",
      onPress: () => {
        exportDatabaseAsJson().catch((error) =>
          console.error("Falha ao exportar dados:", error)
        );
      },
    },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row items-center pr-sm">
          <Pressable
            onPress={() => setIsReordering((prev) => !prev)}
            className="px-sm"
          >
            <MaterialIcons
              name={isReordering ? "check" : "swap-vert"}
              size={20}
              color={isReordering ? colors.primary : colors["text-secondary"]}
            />
          </Pressable>
          {!isReordering && <ContextMenu options={menuOptions} />}
        </View>
      ),
    });
  }, [navigation, isReordering]);

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
        isReordering={isReordering}
      />

      {!isReordering && <FAB onPress={handleOpenAddSheet} />}

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

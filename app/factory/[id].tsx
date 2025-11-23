import { router, Stack, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";

import { withObservables } from "@nozbe/watermelondb/react";
import database, { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";

import ScreenContainer from "@ui/ScreenContainer";
import ContextMenu, { MenuItem } from "@ui/ContextMenu";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";

import EditFactoryNameSheet from "@features/factory/EditFactoryNameSheet";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@theme/colors";

type FactoryDetailsProps = {
  factory: Factory;
};

function FactoryDetails({ factory }: FactoryDetailsProps) {
  const { dismissAll } = useBottomSheetModal();

  const editSheetRef = useRef<BottomSheetModal>(null);
  const confirmSheetRef = useRef<BottomSheetModal>(null);

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
    await factory.updateName(newName);

    dismissAll();
  }

  async function handleConfirmDeletion() {
    await factory.delete();

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

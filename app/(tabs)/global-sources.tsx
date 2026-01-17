import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Pressable } from "react-native";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";

import GlobalSource from "@db/model/GlobalSource";
import { globalSourcesCollection } from "@db/index";

import { getItemData, ITEM_LIST, ItemId } from "@data/item";
import { addGlobalSource } from "@services/globalSourceService";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import ScreenContainer from "@ui/ScreenContainer";
import FAB from "@ui/FAB";
import ConfirmDialog from "@ui/ConfirmDialog";
import Text from "@ui/Text";

import AddGlobalSourceSheet from "@features/global-sources/AddGlobalSourceSheet";
import GlobalSourceList from "@features/global-sources/GlobalSourceList";

import { colors } from "@theme/colors";

type Props = {
  globalSources: GlobalSource[];
};

function GlobalSourcesScreen({ globalSources }: Props) {
  const [globalSourceToDelete, setGlobalSourceToDelete] =
    useState<GlobalSource | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const navigation = useNavigation();

  const addSheetRef = useRef<BottomSheetModal>(null);
  const confirmSheetRef = useRef<BottomSheetModal>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setIsReordering((prev) => !prev)}
          className="px-md"
        >
          <MaterialIcons
            name={isReordering ? "check" : "swap-vert"}
            size={20}
            color={isReordering ? colors.primary : colors["text-secondary"]}
          />
        </Pressable>
      ),
    });
  }, [navigation, isReordering]);

  function handleOpenAddModal() {
    addSheetRef.current?.present();
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

  const addedItems = useMemo(
    () => globalSources.map((gs) => gs.item),
    [globalSources]
  );

  const canAdd = addedItems.length < ITEM_LIST.length;

  return (
    <ScreenContainer>
      <GlobalSourceList
        globalSources={globalSources}
        onUpdateGlobalSource={handleUpdateRate}
        onDeleteGlobalSource={handleDeleteRequest}
        isReordering={isReordering}
      />

      {canAdd && !isReordering && <FAB onPress={handleOpenAddModal} />}

      <AddGlobalSourceSheet
        ref={addSheetRef}
        onAdd={handleAdd}
        excludeItems={addedItems}
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

const enhance = withObservables([], () => ({
  globalSources: globalSourcesCollection.query(Q.sortBy("position", Q.asc)),
}));

export default enhance(GlobalSourcesScreen);

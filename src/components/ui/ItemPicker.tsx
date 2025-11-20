import { useState, useMemo, useRef, useCallback } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  ITEM_LIST,
  Item as ItemType,
  ItemId,
  getItemData,
} from "src/data/item";

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import Text from "@ui/Text";
import Item from "@ui/Item";

import { colors } from "@theme/colors";
import { typography } from "src/utils/typography";

type ItemPickerProps = {
  label?: string;
  selectedItemId: ItemId | null;
  onSelect: (itemId: ItemId) => void;
  placeholder?: string;
};

export default function ItemPicker({
  label,
  selectedItemId,
  onSelect,
  placeholder = "Selecione um item",
}: ItemPickerProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedItemData = selectedItemId ? getItemData(selectedItemId) : null;

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return ITEM_LIST;

    const query = searchQuery.toLowerCase().trim();
    return ITEM_LIST.filter((item) => item.name.toLowerCase().includes(query));
  }, [searchQuery]);

  function handleOpen() {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  }

  function handleSelect(itemId: ItemId) {
    onSelect(itemId);
    Keyboard.dismiss();
    setTimeout(() => {
      bottomSheetRef.current?.close();
    }, 150);
  }

  function handleDismiss() {
    setSearchQuery("");
  }

  const renderItem = useCallback(
    ({ item }: { item: ItemType }) => {
      const isSelected = item.id === selectedItemId;

      return (
        <Pressable
          className={`p-sm rounded-md flex-row items-center justify-between ${isSelected ? "bg-surface-3 border border-primary" : "bg-surface-1 active:bg-background border border-transparent"}`}
          onPress={() => handleSelect(item.id)}
        >
          <View className="flex-row items-center gap-md flex-1">
            <Item icon={item.icon} size="md" />
            <Text
              variant="body"
              className={`${isSelected ? "text-text-primary" : "text-text-secondary"}`}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>

          {isSelected && (
            <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
              <MaterialIcons
                name="check"
                size={16}
                color={colors["text-on-primary"]}
              />
            </View>
          )}
        </Pressable>
      );
    },
    [selectedItemId]
  );

  return (
    <View className="gap-xs">
      {label && (
        <Text variant="body" className="text-text-secondary">
          {label}
        </Text>
      )}

      <Pressable
        className="bg-field rounded-md px-md py-sm text-text-primary text-body border border-border flex-row justify-between items-center gap-md active:scale-99"
        onPress={handleOpen}
      >
        {selectedItemData ? (
          <View className="flex-row items-center gap-sm">
            <Item icon={selectedItemData.icon} size="sm" />
            <Text variant="body" className="text-text-primary">
              {selectedItemData.name}
            </Text>
          </View>
        ) : (
          <Text variant="body" className="text-text-tertiary">
            {placeholder}
          </Text>
        )}

        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={colors["text-secondary"]}
        />
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors["surface-2"] }}
        handleIndicatorStyle={{ backgroundColor: colors["surface-4"] }}
        onDismiss={handleDismiss}
        animationConfigs={{ velocity: 1000 }}
      >
        <View className="px-lg pb-md border-b border-border">
          <Text variant="title" className="text-text-primary">
            Selecione um item
          </Text>
        </View>

        <View className="m-md flex-row items-center bg-field border border-border rounded-md px-md py-sm gap-sm">
          <MaterialIcons
            name="search"
            size={20}
            color={colors["text-secondary"]}
          />

          <BottomSheetTextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar item..."
            style={typography.body}
            className="flex-1 px-0 py-0 text-text-primary"
          />

          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <MaterialIcons
                name="close"
                size={20}
                color={colors["text-secondary"]}
              />
            </Pressable>
          )}
        </View>

        <BottomSheetFlatList
          data={filteredItems}
          initialNumToRender={3}
          keyExtractor={(i: ItemType) => i.id}
          contentContainerClassName="gap-xs px-md"
          keyboardShouldPersistTaps="handled"
          windowSize={7}
          ListEmptyComponent={
            <View className="items-center justify-center py-xl">
              <MaterialIcons
                name="search-off"
                size={48}
                color={colors["text-tertiary"]}
              />

              <Text variant="body" className="text-text-secondary mt-md">
                Nenhum item encontrado
              </Text>
              <Text variant="footnote" className="text-text-tertiary mt-xs">
                Tente buscar por outro nome
              </Text>
            </View>
          }
          renderItem={renderItem}
        />
      </BottomSheetModal>
    </View>
  );
}

function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );
}

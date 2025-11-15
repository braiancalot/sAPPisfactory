import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ITEM_LIST, ItemId, getItemData } from "src/data/item";

import ItemBadge from "@ui/ItemBadge";
import Modal from "@ui/Modal";
import Item from "@ui/Item";
import Text from "@ui/Text";

import { colors } from "@theme/colors";

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
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);

  const selectedItemData = selectedItemId ? getItemData(selectedItemId) : null;

  useEffect(() => {
    if (modalVisible && selectedItemData && flatListRef.current) {
      const index = ITEM_LIST.findIndex((item) => item.id === selectedItemId);

      if (index === -1) return;

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [modalVisible, selectedItemId]);

  function handleSelect(itemId: ItemId) {
    onSelect(itemId);
    setModalVisible(false);
  }

  const ITEM_HEIGHT = 48;
  function getItemLayout(_: any, index: number) {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    };
  }

  return (
    <View className="gap-xs">
      {label && (
        <Text variant="body" className="text-text-secondary">
          {label}
        </Text>
      )}

      <Pressable
        className="bg-field rounded-md px-md py-sm text-text-primary text-body border border-border flex-row justify-between items-center gap-md"
        onPress={() => setModalVisible(true)}
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

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Selecione um Item"
        animationType="slide"
      >
        <View className="max-h-[400]">
          <FlatList
            ref={flatListRef}
            data={ITEM_LIST}
            keyExtractor={(i) => i.id}
            getItemLayout={getItemLayout}
            contentContainerClassName="gap-xs"
            renderItem={({ item }) => {
              const isSelected = item.id === selectedItemId;
              const selectedStyle = isSelected ? "bg-background" : "";

              return (
                <Pressable
                  className={`p-sm rounded-md flex-row items-center justify-between ${selectedStyle} active:bg-surface-2 `}
                  onPress={() => handleSelect(item.id)}
                >
                  <ItemBadge itemId={item.id} size="md" />

                  {isSelected && (
                    <MaterialIcons
                      name="check"
                      size={18}
                      color={colors["text-secondary"]}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

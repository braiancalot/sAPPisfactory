import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getItemData, ITEM_LIST } from "../data/item";
import { theme } from "../theme/theme";

export default function ItemPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = value ? getItemData(value) : null;

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSelect(itemId: string) {
    onChange(itemId);
    handleClose();
  }

  return (
    <>
      <Pressable
        onPress={handleOpen}
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.selectorPressed,
        ]}
      >
        {selected ? (
          <>
            <Image source={selected.icon} style={styles.icon} />
            <Text style={styles.label}>{selected.name}</Text>
          </>
        ) : (
          <Text>Selecione um item</Text>
        )}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />
          <View style={styles.modal}>
            <FlatList
              data={ITEM_LIST}
              keyExtractor={(i) => i.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = value === item.id;
                return (
                  <Pressable
                    onPress={() => handleSelect(item.id)}
                    style={({ pressed }) => [
                      styles.item,
                      isSelected && styles.itemSelected,
                      pressed && styles.itemPressed,
                    ]}
                  >
                    <Image source={item.icon} style={styles.itemIcon} />
                    <Text style={styles.itemLabel}>{item.name}</Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: "rgb(228, 228, 228)",
    minHeight: 44,
  },
  selectorPressed: {
    opacity: 0.9,
  },
  icon: {
    width: 28,
    height: 28,
  },
  label: {
    fontSize: theme.fontSizes.body,
  },
  placeholder: {
    fontSize: theme.fontSizes.body,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: "80%",

    backgroundColor: "#FFF",
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    elevation: theme.elevations.modal,
  },
  list: {
    maxHeight: 320,
  },
  listContent: {
    paddingVertical: theme.spacing.lg,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  itemPressed: {
    backgroundColor: "rgb(185, 185, 185)",
  },

  itemIcon: {
    width: 36,
    height: 36,
  },
  itemLabel: {
    fontSize: theme.fontSizes.body,
  },
  itemSelected: {
    backgroundColor: "rgb(221, 221, 221)",
  },
});

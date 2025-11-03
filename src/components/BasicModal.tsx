import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { theme } from "../theme/theme";
import { formatNumber, sanitizeNumber } from "../utils/numberFormat";
import ItemPicker from "./ItemPicker";

export default function BasicModal({ visible, onClose, onAdd }) {
  const [rate, setRate] = useState("");
  const [item, setItem] = useState(null);

  function handleRateChange(text: string) {
    const cleanedValue = sanitizeNumber(text);
    const parsedValue = parseInt(cleanedValue, 10);

    if (!isNaN(parsedValue)) {
      setRate(parsedValue.toString());
    } else {
      setRate("");
    }
  }

  function handleAdd() {
    onAdd(item, parseInt(rate, 10));
    setRate("");
    setItem(null);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalView}>
          <Text style={styles.title}>Adicionar fonte</Text>

          <ItemPicker value={item} onChange={setItem} />

          <TextInput
            keyboardType="number-pad"
            placeholder="Taxa por minuto (ex: 780)"
            placeholderTextColor="#AAA"
            value={formatNumber(rate)}
            onChangeText={handleRateChange}
            style={styles.rateInput}
          />

          <View style={styles.actionContainer}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: pressed
                    ? theme.colors.accent.dark
                    : theme.colors.accent.DEFAULT,
                },
              ]}
            >
              <Text style={styles.addButtonText}>Adicionar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    alignItems: "flex-start",
    elevation: theme.elevations.modal,
  },
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: 600,
  },
  rateInput: {
    backgroundColor: "3c3c3c",
    borderColor: "#555",
    borderWidth: 1,
    width: "80%",
    color: "#000",
  },
  actionContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontWeight: 700,
    fontSize: theme.fontSizes.button,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
  },
  addButtonText: {
    color: "white",
    fontWeight: 700,
    fontSize: theme.fontSizes.button,
  },
});

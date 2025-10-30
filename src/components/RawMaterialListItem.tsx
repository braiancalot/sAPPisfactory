import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function RawMaterialListItem({ name, rate }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.rateContainer}>
        <Text style={styles.rateNumber}>{rate}</Text>
        <Text style={styles.rateText}>/ min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "medium",
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  rateNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  rateText: {
    fontSize: 12,
    fontWeight: "regular",
    marginBottom: 2,
    color: "#AAA",
  },
});

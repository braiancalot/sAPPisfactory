import { Image, StyleSheet, Text, View } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import GlobalSource from "../db/model/GlobalSource";
import { MaterialIcons } from "@expo/vector-icons";
import database from "../db";
import { getIconByItemId } from "../assets/iconMapper";
import { theme } from "../theme/theme";
import { getItemData } from "../data/item";

type Props = {
  globalSource: GlobalSource;
};

function GlobalSourceListItem({ globalSource }: Props) {
  const itemData = getItemData(globalSource.item);

  async function handleDelete() {
    await database.write(async () => {
      await globalSource.markAsDeleted();
    });
  }

  return (
    <View style={styles.container}>
      <Image source={itemData.icon} style={styles.icon} />

      <Text style={styles.name}>{itemData.name}</Text>

      <View style={styles.rateContainer}>
        <Text style={styles.rateNumber}>{globalSource.totalRatePerMin}</Text>
        <Text style={styles.rateText}>/ min</Text>
      </View>

      <MaterialIcons name="delete" size={18} onPress={handleDelete} />
    </View>
  );
}

const enhance = withObservables<Props, { globalSource: GlobalSource }>(
  ["globalSource"],
  ({ globalSource }) => ({ globalSource })
);

export default enhance(GlobalSourceListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 4,
    elevation: theme.elevations.card,
  },
  icon: {
    width: 48,
    height: 48,
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

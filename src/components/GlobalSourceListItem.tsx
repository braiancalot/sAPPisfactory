import { StyleSheet, Text, View } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import GlobalSource from "../db/model/GlobalSource";
import { MaterialIcons } from "@expo/vector-icons";
import database from "../db";

type Props = {
  globalSource: GlobalSource;
};

function GlobalSourceListItem({ globalSource }: Props) {
  async function handleDelete() {
    await database.write(async () => {
      await globalSource.markAsDeleted();
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{globalSource.item}</Text>

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

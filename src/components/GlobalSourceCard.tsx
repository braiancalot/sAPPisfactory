import { StyleSheet, Text, View } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import { MaterialIcons } from "@expo/vector-icons";

import database from "../db";
import GlobalSource from "../db/model/GlobalSource";
import { getItemData } from "../data/item";

// import { theme } from "../theme/theme";
import { Image } from "@ui/Image";

type Props = {
  globalSource: GlobalSource;
};

function GlobalSourceCard({ globalSource }: Props) {
  const itemData = getItemData(globalSource.item);

  async function handleDelete() {
    await database.write(async () => {
      await globalSource.markAsDeleted();
    });
  }

  return (
    <View style={styles.container} className="bg-surface">
      <Image source={itemData.icon} className="w-12 h-12" />

      <Text className="text-lg text-textPrimary font-medium">
        {itemData.name}
      </Text>

      <View style={styles.rateContainer}>
        <Text className="text-textPrimary text-xl font-bold">
          {globalSource.totalRatePerMin}
        </Text>
        <Text className="text-textSecondary">/min</Text>
      </View>

      <MaterialIcons
        name="delete"
        size={18}
        color="white"
        onPress={handleDelete}
      />
    </View>
  );
}

const enhance = withObservables<Props, { globalSource: GlobalSource }>(
  ["globalSource"],
  ({ globalSource }) => ({ globalSource })
);

export default enhance(GlobalSourceCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,

    borderRadius: 4,
    // elevation: theme.elevations.card,
  },
  icon: {
    width: 48,
    height: 48,
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
});

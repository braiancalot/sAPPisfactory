import { FlatList } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

import { globalSourcesCollection } from "../db";
import GlobalSource from "../db/model/GlobalSource";

import GlobalSourceCard from "./GlobalSourceCard";
import { theme } from "../theme/theme";

function GlobalSourceList({
  globalSources,
}: {
  globalSources: GlobalSource[];
}) {
  return (
    <FlatList
      data={globalSources}
      contentContainerStyle={{
        gap: theme.spacing.md,
        paddingBottom: 96,
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
      }}
      renderItem={({ item }) => <GlobalSourceCard globalSource={item} />}
    />
  );
}

const enhance = withObservables([], () => ({
  globalSources: globalSourcesCollection.query(),
}));

export default enhance(GlobalSourceList);

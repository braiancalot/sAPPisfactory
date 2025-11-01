import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { globalSourcesCollection } from "../db";
import GlobalSourceListItem from "./GlobalSourceListItem";
import GlobalSource from "../db/model/GlobalSource";

export default function GlobalSourceList() {
  const [globalSources, setGlobalSources] = useState<GlobalSource[]>([]);

  useEffect(() => {
    const fetchGlobalSource = async () => {
      const globalSources = await globalSourcesCollection.query().fetch();
      setGlobalSources(globalSources);
    };

    fetchGlobalSource();
  }, []);

  return (
    <FlatList
      data={globalSources}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }) => <GlobalSourceListItem source={item} />}
    />
  );
}

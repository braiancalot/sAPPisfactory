import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { factoriesCollection } from "@db/index";
import Factory from "@db/model/Factory";

import ScreenContainer from "@ui/ScreenContainer";

export default function FactoryScreen() {
  const { id } = useLocalSearchParams();
  const [factory, setFactory] = useState<Factory | null>(null);

  useEffect(() => {
    const factoryId = Array.isArray(id) ? id[0] : id;
    if (!factoryId) return;

    async function getFactory() {
      const result = await factoriesCollection.find(factoryId);
      setFactory(result);
    }

    getFactory();
  }, [id]);

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: factory?.name || "Carregando..." }} />
    </ScreenContainer>
  );
}

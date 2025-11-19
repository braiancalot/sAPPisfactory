import { useLocalSearchParams } from "expo-router";

import ScreenContainer from "@ui/ScreenContainer";
import Text from "@ui/Text";

export default function FactoryScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScreenContainer>
      <Text variant="title" className="text-text-primary">
        {id}
      </Text>
    </ScreenContainer>
  );
}

import { Button, View } from "react-native";

import RawMaterialList from "../../../src/components/RawMaterialList";

export default function RawMaterialScreen() {
  return (
    <View>
      <RawMaterialList />

      <Button title="Adicionar matéria-prima" />
    </View>
  );
}

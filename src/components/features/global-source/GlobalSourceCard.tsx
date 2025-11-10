import { useState } from "react";
import GlobalSource from "@db/model/GlobalSource";
import { getItemData } from "@data/item";

import PressableCard from "@ui/PressableCard";
import RateDisplay from "@ui/RateDisplay";

import { Pressable, Text, View } from "react-native";
import Item from "@ui/Item";
import Input from "@ui/Input";
import { formatPtBrNumber, parsePtBrNumber } from "src/utils/numberFormat";

type Props = {
  globalSource: GlobalSource;
  onUpdate: (source: GlobalSource, newRate: number) => void;
  onDelete: (source: GlobalSource) => void;
};

export default function GlobalSourceCard({
  globalSource,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    formatPtBrNumber(globalSource.totalRatePerMin)
  );

  const itemData = getItemData(globalSource.item);

  async function handleSave() {
    setIsEditing(false);
    onUpdate(globalSource, parsePtBrNumber(editValue));
  }

  function handleCancelEdit() {
    setEditValue(formatPtBrNumber(globalSource.totalRatePerMin));
    setIsEditing(false);
  }

  function handleDelete() {
    onDelete(globalSource);
  }

  return (
    <PressableCard onLongPress={handleDelete}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-md">
          <Item icon={itemData.icon} size="md" />
          <Text className="text-body text-text-primary font-medium">
            {itemData.name}
          </Text>
        </View>

        <View className="gap-sm items-end">
          {isEditing ? (
            <Input
              value={editValue}
              onChangeValue={setEditValue}
              autoFocus
              numeric
              onSubmit={handleSave}
              onBlur={handleCancelEdit}
            />
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <RateDisplay
                value={globalSource.totalRatePerMin}
                size="sm"
                colored={false}
              />
            </Pressable>
          )}

          <RateDisplay value={globalSource.totalRatePerMin - 120.5} size="sm" />
        </View>
      </View>
    </PressableCard>
  );
}

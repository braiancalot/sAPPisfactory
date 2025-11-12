import { useState } from "react";
import GlobalSource from "@db/model/GlobalSource";
import { getItemData } from "@data/item";

import PressableCard from "@ui/PressableCard";
import RateDisplay from "@ui/RateDisplay";

import { Text, View } from "react-native";

import Item from "@ui/Item";
import Input from "@ui/Input";

import { parsePtBrNumber, sanitizeNumericInput } from "src/utils/numberFormat";

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
  const [editValue, setEditValue] = useState("");

  const itemData = getItemData(globalSource.item);

  function handleStartEdit() {
    setEditValue(sanitizeNumericInput(globalSource.totalRatePerMin.toString()));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleSave() {
    setIsEditing(false);
    onUpdate(globalSource, parsePtBrNumber(editValue));
  }

  function handleDelete() {
    onDelete(globalSource);
  }

  return (
    <PressableCard onPress={handleStartEdit} onLongPress={handleDelete}>
      <View className="flex-row items-center justify-between gap-md">
        <View className="flex-row items-center gap-xl flex-1">
          <Item icon={itemData.icon} size="md" />

          <View className="gap-xs items-start flex-1">
            <Text
              className="text-subhead text-text-primary font-bold"
              numberOfLines={1}
            >
              {itemData.name}
            </Text>

            {isEditing ? (
              <Input
                value={editValue}
                onChangeValue={setEditValue}
                onSubmit={handleSave}
                numeric
                autoFocus
                onBlur={handleCancelEdit}
                variant="borderless"
                className="border-b border-accent mb-[-1] w-24"
              />
            ) : (
              <RateDisplay
                value={globalSource.totalRatePerMin}
                size="sm"
                colored={false}
              />
            )}
          </View>
        </View>

        <RateDisplay value={globalSource.totalRatePerMin - 120.5} size="md" />
      </View>
    </PressableCard>
  );
}

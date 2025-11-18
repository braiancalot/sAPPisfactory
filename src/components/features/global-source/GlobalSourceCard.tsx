import { useState } from "react";

import Animated, {
  FadeInLeft,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";

import GlobalSource from "@db/model/GlobalSource";
import { getItemData } from "@data/item";
import PressableCard from "@ui/PressableCard";
import RateDisplay from "@ui/RateDisplay";

import Item from "@ui/Item";
import Input from "@ui/Input";
import Text from "@ui/Text";

import { View } from "react-native";

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
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutLeft}
      layout={LinearTransition.springify()}
    >
      <PressableCard onPress={handleStartEdit} onLongPress={handleDelete}>
        <View className="flex-row items-baseline justify-between gap-md">
          <View className="flex-row items-center gap-lg flex-1">
            <Item icon={itemData.icon} size="md" />

            <View className="gap-2xs items-start flex-1">
              <Text
                variant="subhead"
                className="text-text-primary flex-wrap"
                numberOfLines={2}
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
                  className="border-b border-primary mb-[-1] w-24 text-primary"
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

          <View className="max-w-40">
            <RateDisplay value={globalSource.totalRatePerMin} size="md" />
          </View>
        </View>
      </PressableCard>
    </Animated.View>
  );
}

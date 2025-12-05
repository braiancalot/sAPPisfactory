import { useState } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

import { withObservables } from "@nozbe/watermelondb/react";

import GlobalSource from "@db/model/GlobalSource";
import { getItemData } from "@data/item";

import RateDisplay from "@ui/RateDisplay";
import Item from "@ui/Item";
import Input from "@ui/Input";
import Text from "@ui/Text";
import SwipeableCard from "@ui/SwipeableCard";

import { parsePtBrNumber, sanitizeNumericInput } from "src/utils/numberFormat";
import { typography } from "src/utils/typography";

type Props = {
  globalSource: GlobalSource;
  onUpdate: (source: GlobalSource, newRate: number) => void;
  onDelete: (source: GlobalSource) => void;
};

function GlobalSourceCard({ globalSource, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const itemData = getItemData(globalSource.item);

  function handleStartEdit() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditValue(sanitizeNumericInput(globalSource.totalRatePerMin.toString()));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleSave() {
    setIsEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onUpdate(globalSource, parsePtBrNumber(editValue));
  }

  function handleDelete() {
    onDelete(globalSource);
  }

  return (
    <SwipeableCard
      onPress={handleStartEdit}
      onDelete={handleDelete}
      disabled={isEditing}
      shouldResetOnAction
      className="p-md rounded-lg"
    >
      <View className="flex-row items-center justify-between gap-md">
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
                className="border-b border-secondary w-[48px] text-left text-secondary p-0 h-[19px]"
                style={[typography.numberSm, { paddingVertical: 0 }]}
              />
            ) : (
              <View className="h-[19px]">
                <RateDisplay
                  value={globalSource.totalRatePerMin}
                  size="sm"
                  colored={false}
                />
              </View>
            )}
          </View>
        </View>

        <View className="max-w-40">
          <RateDisplay value={globalSource.totalRatePerMin} size="md" />
        </View>
      </View>
    </SwipeableCard>
  );
}

const enhance = withObservables(["globalSource"], ({ globalSource }) => ({
  globalSource: globalSource,
}));

export default enhance(GlobalSourceCard) as React.ComponentType<Props>;

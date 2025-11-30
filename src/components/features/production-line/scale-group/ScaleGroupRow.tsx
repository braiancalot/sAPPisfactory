import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";

import { withObservables } from "@nozbe/watermelondb/react";

import ScaleGroup from "@db/model/ScaleGroup";

import { parsePtBrNumber, sanitizeNumericInput } from "src/utils/numberFormat";

import Text from "@ui/Text";
import Input from "@ui/Input";

import { colors } from "@theme/colors";
import { typography } from "src/utils/typography";
import { MaterialIcons } from "@expo/vector-icons";

type SomersloopSelector = {
  count: number;
  onToggle: () => void;
};

function SomersloopSelector({ count, onToggle }: SomersloopSelector) {
  const isActive = count > 0;

  const multiplierMap = ["", "1.25x", "1.5x", "1.75x", "2.0x"];
  const currentMultiplier = multiplierMap[count];

  return (
    <View className="flex-row items-center gap-xs">
      {isActive && (
        <View className="items-end">
          <Text variant="caption" className="text-alien">
            {currentMultiplier}
          </Text>
          <Text variant="caption" className="text-alien/60 uppercase">
            Prod.
          </Text>
        </View>
      )}

      <Pressable
        onPress={onToggle}
        hitSlop={8}
        className={`w-8 h-8 rounded-full items-center justify-center ${
          isActive ? "bg-alien/20 active:bg-alien/30" : "bg-surface-3"
        }`}
      >
        {isActive ? (
          <Text variant="bodyHighlight" className="text-alien">
            {count}
          </Text>
        ) : (
          <MaterialIcons name="bolt" size={18} color={colors["alien"]} />
        )}
      </Pressable>
    </View>
  );
}

type StepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
};

function Stepper({ value, onIncrement, onDecrement, onDelete }: StepperProps) {
  const [isOpen, setIsOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, value]);

  const toggle = () => setIsOpen(!isOpen);

  const ActionButton = ({
    icon,
    onPress,
    onLongPress = () => {},
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
    onLongPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="w-7 h-7 items-center justify-center bg-surface-3 rounded-full active:bg-surface-4"
      onLongPress={onLongPress}
    >
      <MaterialIcons name={icon} size={14} color={colors["text-primary"]} />
    </Pressable>
  );

  return (
    <View className="justify-center items-center min-w-[32px]">
      <View className={`flex-row items-center ${isOpen ? "gap-xs" : "gap-0"}`}>
        {isOpen && (
          <ActionButton
            icon="remove"
            onPress={onDecrement}
            onLongPress={onDelete}
          />
        )}

        <Pressable
          onPress={toggle}
          className={`justify-center items-center ${isOpen ? "w-[32px]" : "w-auto"}`}
        >
          <Text variant="numberMd" className="text-text-primary">
            {value}
            <Text variant="body" className="text-text-tertiary">
              x
            </Text>
          </Text>
        </Pressable>

        {isOpen && <ActionButton icon="add" onPress={onIncrement} />}
      </View>
    </View>
  );
}

type ScaleGroupRowProps = {
  scaleGroup: ScaleGroup;
};

function ScaleGroupRow({ scaleGroup }: ScaleGroupRowProps) {
  const [isEditingClock, setIsEditingClock] = useState(false);
  const [clockEditValue, setClockEditValue] = useState("");

  const hasSomersloop = scaleGroup.somersloopCount > 0;

  async function handleToggleSomersloop() {
    const currentCount = scaleGroup.somersloopCount;
    const nextCount = currentCount >= 4 ? 0 : currentCount + 1;
    await scaleGroup.updateSomersloopCount(nextCount);
  }

  async function handleIncrement() {
    const newCount = scaleGroup.moduleCount + 1;
    if (newCount < 99) await scaleGroup.updateModuleCount(newCount);
  }

  async function handleDecrement() {
    const newCount = scaleGroup.moduleCount - 1;

    if (newCount <= 0) {
      await scaleGroup.delete();
    } else {
      await scaleGroup.updateModuleCount(newCount);
    }
  }

  async function handleDelete() {
    await scaleGroup.delete();
  }

  async function startClockEdit() {
    setClockEditValue(
      sanitizeNumericInput(scaleGroup.clockSpeedPercent.toString())
    );
    setIsEditingClock(true);
  }

  async function saveClock() {
    setIsEditingClock(false);
    const val = Math.min(Math.max(parsePtBrNumber(clockEditValue), 0), 250);
    await scaleGroup.updateClockSpeed(val);
  }

  return (
    <View
      className={`flex-row items-center p-sm gap-md rounded-md bg-surface-2 border ${hasSomersloop ? "border-alien/50" : "border-transparent"}`}
    >
      <View>
        <Stepper
          value={scaleGroup.moduleCount}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onDelete={handleDelete}
        />
      </View>

      <View className="flex-1 px-md justify-center gap-xs">
        <View className="flex-row justify-between items-baseline gap-xs">
          <Text
            variant="body"
            className="text-text-tertiary flex-1"
            numberOfLines={1}
          >
            Clock
          </Text>

          {isEditingClock ? (
            <View className="flex-row items-end">
              <Input
                value={clockEditValue}
                onChangeValue={setClockEditValue}
                onBlur={saveClock}
                onSubmit={saveClock}
                autoFocus
                numeric
                variant="borderless"
                className="border-b border-secondary min-w-[8] max-w-[90] mb-[-1px] text-right text-secondary p-0"
                style={[typography.numberSm, { paddingVertical: 0 }]}
              />
              <Text variant="numberSm" className="text-secondary">
                %
              </Text>
            </View>
          ) : (
            <Pressable onPress={startClockEdit}>
              <Text variant="body" className="text-primary">
                {scaleGroup.clockSpeedPercent}%
              </Text>
            </Pressable>
          )}
        </View>

        <View className="h-1 bg-surface-4 rounded-full overflow-hidden w-full">
          <View
            className="h-full bg-primary"
            style={{
              width: `${Math.min(scaleGroup.clockSpeedPercent / 2.5, 100)}%`,
            }}
          />
        </View>
      </View>

      <View className="items-end pl-xs">
        <SomersloopSelector
          count={scaleGroup.somersloopCount}
          onToggle={handleToggleSomersloop}
        />
      </View>
    </View>
  );
}

const enhance = withObservables(
  ["scaleGroup"],
  ({ scaleGroup }: ScaleGroupRowProps) => ({
    scaleGroup,
  })
);

export default enhance(
  ScaleGroupRow
) as React.ComponentType<ScaleGroupRowProps>;

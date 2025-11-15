import { Pressable } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function PressableCard({
  children,
  onPress = () => {},
  onLongPress = () => {},
}: Props) {
  return (
    <Pressable
      className="bg-surface-2 active:bg-surface-3 p-md rounded-lg active:scale-99"
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Pressable>
  );
}

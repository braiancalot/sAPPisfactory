import { Pressable } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
};

export default function PressableCard({
  children,
  onPress = () => {},
  onLongPress = () => {},
  className = "",
}: Props) {
  return (
    <Pressable
      className={`bg-surface-2 active:bg-surface-3 p-md rounded-lg active:scale-99 ${className}`}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Pressable>
  );
}

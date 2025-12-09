import { Pressable } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
};

export default function PressableCard({
  children,
  onPress = () => {},
  onLongPress = () => {},
  backgroundColor = "bg-surface-2",
  activeBackgroundColor = "bg-surface-3",
  className = "",
}: Props) {
  return (
    <Pressable
      className={`${backgroundColor} active:${activeBackgroundColor} p-md rounded-lg active:scale-99 ${className}`}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Pressable>
  );
}

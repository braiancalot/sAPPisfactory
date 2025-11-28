import { View } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <View className={`bg-surface-1 rounded-lg p-lg ${className}`}>
      {children}
    </View>
  );
}

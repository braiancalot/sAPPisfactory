import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return <View className="bg-surface-1 rounded-lg p-lg">{children}</View>;
}

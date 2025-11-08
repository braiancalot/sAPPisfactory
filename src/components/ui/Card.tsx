import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <View className="bg-surface p-lg rounded-lg" style={{ elevation: 2 }}>
      {children}
    </View>
  );
}

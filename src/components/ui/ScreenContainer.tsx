import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  return <View className="flex-1 bg-background">{children}</View>;
}

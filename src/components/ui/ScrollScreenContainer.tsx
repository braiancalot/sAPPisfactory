import { ScrollView } from "react-native";

type Props = {
  withFAB?: boolean;
  children: React.ReactNode;
};

export default function ScrollScreenContainer({
  withFAB = false,
  children,
}: Props) {
  const containerClass = withFAB ? "pb-[96]" : "";

  return (
    <ScrollView
      contentContainerClassName={`p-lg ${containerClass}`}
      className="flex-1 bg-background"
    >
      {children}
    </ScrollView>
  );
}

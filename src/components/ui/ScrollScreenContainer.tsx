import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type Props = {
  children: React.ReactNode;
  showsVerticalScrollIndicator?: boolean;
};

export default function ScrollScreenContainer({
  children,
  showsVerticalScrollIndicator = true,
}: Props) {
  return (
    <KeyboardAwareScrollView
      contentContainerClassName="pb-[96]"
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type Props = {
  withFAB?: boolean;
  children: React.ReactNode;
};

export default function ScrollScreenContainer({ children }: Props) {
  return (
    <KeyboardAwareScrollView
      contentContainerClassName="pb-[96]"
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="always"
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

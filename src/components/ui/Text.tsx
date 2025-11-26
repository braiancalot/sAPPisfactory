import { Text as RNText, TextProps } from "react-native";
import { typography } from "src/utils/typography";

export type TextVariant =
  | "caption"
  | "footnote"
  | "body"
  | "bodyHighlight"
  | "subhead"
  | "button"
  | "title"
  | "headline"
  | "numberSm"
  | "numberMd"
  | "numberLg";

type Props = TextProps & {
  variant?: TextVariant;
  className?: string;
};

export default function Text({
  variant = "body",
  className = "",
  style,
  children,
  ...props
}: Props) {
  const fontStyle = {
    caption: typography.caption,
    footnote: typography.footnote,
    body: typography.body,
    bodyHighlight: typography.bodyHighlight,
    subhead: typography.subhead,
    button: typography.button,
    title: typography.title,
    headline: typography.headline,
    numberSm: typography.numberSm,
    numberMd: typography.numberMd,
    numberLg: typography.numberLg,
  }[variant];

  return (
    <RNText {...props} className={className} style={[fontStyle, style]}>
      {children}
    </RNText>
  );
}

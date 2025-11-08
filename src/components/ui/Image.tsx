import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";

function ImageImpt({ ...props }: React.ComponentProps<typeof ExpoImage>) {
  return <ExpoImage {...props} />;
}

export const Image = cssInterop(ImageImpt, {
  className: "style",
});

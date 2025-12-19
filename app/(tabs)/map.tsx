import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Asset } from "expo-asset";
import { unzip } from "react-native-zip-archive";
import * as FileSystem from "expo-file-system/legacy";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

import { withObservables } from "@nozbe/watermelondb/react";
import { collectiblesCollection } from "@db/index";
import Collectible from "@db/model/Collectible";

import ScreenContainer from "@ui/ScreenContainer";
import Text from "@ui/Text";

import { colors } from "@theme/colors";

const MAP_DIR = FileSystem.documentDirectory + "satisfactory_map/";

type Props = {
  collectibles: Collectible[];
};

function MapScreen({ collectibles }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const collectiblesJson = useMemo(() => {
    return collectibles.map((item) => ({
      id: item.id,
      x: item.x,
      y: item.y,
      z: item.z,
      name: item.name,
      icon: item.icon,
      collected: item.collected,
    }));
  }, [collectibles]);

  useEffect(() => {
    async function setupMap() {
      const dirInfo = await FileSystem.getInfoAsync(MAP_DIR);
      if (!dirInfo.exists) {
        const asset = Asset.fromModule(require("../../assets/tiles.zip"));
        await asset.downloadAsync();
        await FileSystem.makeDirectoryAsync(MAP_DIR, { intermediates: true });
        if (asset.localUri) await unzip(asset.localUri, MAP_DIR);
      }

      const htmlAsset = Asset.fromModule(require("../../assets/index.html"));
      await htmlAsset.downloadAsync();
      if (htmlAsset.localUri) {
        let htmlString = await FileSystem.readAsStringAsync(htmlAsset.localUri);
        setHtmlContent(htmlString);
        setReady(true);
      }
    }

    setupMap();
  }, []);

  useEffect(() => {
    if (ready && isWebViewReady && webViewRef.current) {
      const data = JSON.stringify(collectiblesJson);
      webViewRef.current.injectJavaScript(`
      if (window.renderMarkers) {
        window.renderMarkers('${data}');
      }
      true;
    `);
    }
  }, [collectiblesJson, ready, isWebViewReady]);

  async function handleMessage(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "READY") {
        setIsWebViewReady(true);
      }

      if (data.type === "TOGGLE_COLLECTIBLE") {
        const id = data.id;
        const collectible = await collectiblesCollection.find(id);

        if (collectible) {
          const newStatus = !collectible.collected;
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
              if (window.updateCollectibleStatus) {
                window.updateCollectibleStatus('${id}', ${newStatus});
              }
              true;
            `);
          }

          await collectible.toggleCollected();
        }
      }
    } catch (error) {
      console.log("Error reading message:", error);
    }
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center gap-md">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" className="text-text-primary">
          Carregando mapa...
        </Text>
      </View>
    );
  }

  const tilePath = MAP_DIR.replace(/\/$/, "");
  const injectedJS = `
    window.TILE_PATH = "${tilePath}";
    true;
  `;

  return (
    <ScreenContainer>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent, baseUrl: MAP_DIR }}
        style={{ flex: 1 }}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        javaScriptEnabled={true}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        onMessage={handleMessage}
      />
    </ScreenContainer>
  );
}

const enhance = withObservables([], () => ({
  collectibles: collectiblesCollection.query().observe(),
}));

export default enhance(MapScreen);

import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Asset } from "expo-asset";
import { unzip } from "react-native-zip-archive";
import * as FileSystem from "expo-file-system/legacy";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";

import ScreenContainer from "@ui/ScreenContainer";
import Text from "@ui/Text";

import { colors } from "@theme/colors";

const MAP_DIR = FileSystem.documentDirectory + "satisfactory_map/";

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const [nodes, setNodes] = useState([
    {
      id: "node_1",
      x: 38000.171875,
      y: 91735.953125,
      z: -4809.0512695312,
      name: "Esfera de Mercer",
      icon: "icons/mercer_sphere.png",
      collected: false,
    },
    {
      id: "node_2",
      x: -75893.15625,
      y: 51636.9609375,
      z: 19145.953125,
      name: "Esfera de Mercer",
      icon: "icons/somersloop.png",
      collected: true,
    },
  ]);

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
      const data = JSON.stringify(nodes);
      webViewRef.current.injectJavaScript(`
      if (window.renderMarkers) {
        window.renderMarkers('${data}');
      }
      true;
    `);
    }
  }, [nodes, ready, isWebViewReady]);

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "READY") {
        setIsWebViewReady(true);
      }

      if (data.type === "TOGGLE_NODE") {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === data.id ? { ...node, collected: !node.collected } : node
          )
        );
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

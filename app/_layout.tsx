import { initializeI18n } from "@/i18n";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Promise.all([
          Font.loadAsync(FontAwesome.font),
          Font.loadAsync({
            SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
          }),
        ]);
        await initializeI18n();

        const storageValues = await AsyncStorage.multiGet([
          "@zora/language",
          "@zora/age",
        ]);
        const [, storageLanguage] = storageValues[0];
        if (storageLanguage) {
          setSelectedLanguage(storageLanguage);
        }
        const [, storageAge] = storageValues[1];
        if (storageAge) {
          setSelectedAge(storageAge);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hide();
      if (!selectedLanguage) {
        router.push("/settings/language", { withAnchor: true });
      } else if (!selectedAge) {
        router.push("/settings/age", { withAnchor: true });
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="account"
        options={{ headerShown: false, title: "Administration" }}
      />
      <Stack.Screen
        name="settings/language"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="settings/age"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="dashboard/notifications"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

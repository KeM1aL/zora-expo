import { AgeModal } from "@/components/settings/AgeModal";
import { LanguageModal } from "@/components/settings/LanguageModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { initializeI18n } from "@/i18n";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

function AppInitializer() {
  const { isLoading: isAuthLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hide();
      if (!selectedLanguage) {
        setShowLanguageModal(true);
      } else if (!selectedAge) {
        setShowAgeModal(true);
      }
    }
  }, [appIsReady]);

  const handleCloseLanguageModal = () => {
    setShowLanguageModal(false);
    if (!selectedAge) {
      setShowAgeModal(true);
    }
  };

  const handleCloseAgeModal = () => {
    setShowAgeModal(false);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="account"
          options={{ headerShown: false, title: "Account" }}
        />
        <Stack.Screen
          name="dashboard/notifications"
          options={{ headerShown: false }}
        />
      </Stack>
      <LanguageModal
        visible={showLanguageModal}
        onClose={handleCloseLanguageModal}
      />
      <AgeModal visible={showAgeModal} onClose={handleCloseAgeModal} />
    </>
  );
}
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <AppInitializer />
        </QueryClientProvider>
      </UserProvider>
    </AuthProvider>
  );
}

import HeaderAccountButton from "@/components/ui/HeaderAccountButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <HeaderAccountButton visible={true} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "blue",
          tabBarStyle: {
            height: 50, // Increased height to accommodate text and padding
          },
          tabBarLabelStyle: {
            paddingBottom: 20, // Add padding to ensure text is not cut off
          },
          tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is open
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tab.create"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="microphone" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stories"
          options={{
            title: t("tab.stories"),
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({});

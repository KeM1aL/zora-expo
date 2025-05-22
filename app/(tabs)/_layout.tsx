import HeaderAccountButton from "@/components/ui/HeaderAccountButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
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
            title: "Tell Me",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="microphone" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stories"
          options={{
            title: "My Stories",
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

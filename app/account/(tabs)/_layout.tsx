import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function AccountTabLayout() {
  return (
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
            title: "Account Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
            headerRight: () => (
              <Link href="../" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="close"
                      size={25}
                      color="blue"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="profiles"
          options={{
            title: "Profiles",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="users" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
  );
}

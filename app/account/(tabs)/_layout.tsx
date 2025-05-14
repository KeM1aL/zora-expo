import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: "My Kids",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="child" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gears" color={color} />
          ),
        }}
      />
    </Tabs>
    
  );
}

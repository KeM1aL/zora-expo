import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
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
  );
}

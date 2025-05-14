import { Stack } from "expo-router";

export default function AccountLayout() {

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

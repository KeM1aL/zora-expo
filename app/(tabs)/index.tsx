import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function StoryCreatorTab() {
  return (
    <View style={styles.container}>
      <Text>Tab Story Creator</Text>
      <Link href="/settings/language">
        Open modal
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

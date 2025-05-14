import { StyleSheet, Text, View } from "react-native";

export default function StoryDashboardTab() {
  return (
    <View style={styles.container}>
      <Text>Tab Story Dashboard</Text>
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

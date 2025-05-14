import { StyleSheet, Text, View } from "react-native";

export default function AccountTab() {
  return (
    <View style={styles.container}>
      <Text>Tab Account</Text>
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

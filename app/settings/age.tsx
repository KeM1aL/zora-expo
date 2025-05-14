import { StyleSheet, Text, View } from 'react-native';

export default function AgeModal() {
  return (
    <View style={styles.container}>
      <Text>Modal Age</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

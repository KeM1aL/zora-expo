import { StyleSheet, Text, View } from 'react-native';

export default function LanguageModal() {
  return (
    <View style={styles.container}>
      <Text>Modal Language</Text>
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

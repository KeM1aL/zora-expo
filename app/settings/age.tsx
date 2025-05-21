import { AgeSwitcher } from '@/components/settings/AgeSwitcher';
import { StyleSheet, View } from 'react-native';

export default function AgeModal() {
  return (
    <View style={styles.container}>
      <AgeSwitcher/>
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

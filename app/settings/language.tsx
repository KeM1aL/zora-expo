import { LanguageSwitcher } from '@/components/settings/LanguageSwitcher';
import { StyleSheet, View } from 'react-native';

export default function LanguageModal() {
  return (
    <View style={styles.container}>
      <LanguageSwitcher/>
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

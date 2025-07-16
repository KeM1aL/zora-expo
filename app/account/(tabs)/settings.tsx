import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsTab() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('account.settings.title')}</Text>
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

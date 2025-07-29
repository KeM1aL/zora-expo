import AccountScreen from "@/components/account/AccountScreen";
import { LoginScreen } from "@/components/account/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function AccountTab() {
  const { isAuthenticated, isLoading, user, isAnonymous } = useAuth();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      {!isAuthenticated || isAnonymous ? (
        <LoginScreen />
      ) : (
        <AccountScreen />
      )}
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

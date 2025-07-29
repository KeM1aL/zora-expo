import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { LogOut } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AccountOverview } from "./AccountOverview";
import { PaymentFAQ } from "./PaymentFAQ";
import { PaymentOptions } from "./PaymentOptions";

export default function AccountScreen() {
  const { signOut } = useAuth();
  const { profile, reloadProfile } = useUser();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);

      // This would call an actual API to cancel the subscription
      // For now, we'll just simulate it
      Alert.alert(
        t("account.cancelSubscription.success.title"),
        t("account.cancelSubscription.success.message"),
        [{ text: t("common.close") }]
      );

      setError(null);
    } catch (err: any) {
      setError(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle credit purchase
  const handlePurchase = async (packageId: string, isSubscription: boolean) => {
    try {
      setIsLoading(true);

      // Determine credit amount from package ID
      // This would be more robust in a real implementation
      let creditAmount = 0;

      if (isSubscription) {
        creditAmount = packageId === "monthly" ? 20 : 30;
        await purchaseCredits(creditAmount, true);
      } else {
        // One-time purchase
        switch (packageId) {
          case "small":
            creditAmount = 10;
            break;
          case "medium":
            creditAmount = 30;
            break;
          case "large":
            creditAmount = 60;
            break;
          case "xlarge":
            creditAmount = 100;
            break;
        }
        await purchaseCredits(creditAmount, false);
      }

      // Success state handling
      setError(null);
    } catch (err: any) {
      setError(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserView = () => (
    <Animated.View style={{ flex: 1 }}>
      {/* Account Overview with subscription details */}
      <AccountOverview
        credits={profile?.credits || 0}
        plan={profile?.membership_plan || "free"}
        email={profile?.email || ""}
        lastRenewal="2025-03-01T00:00:00.000Z" // Example date for demo
        nextRenewal="2025-04-01T00:00:00.000Z" // Example date for demo
        onCancelSubscription={
          profile?.membership_plan === "premium" ? handleCancelSubscription : undefined
        }
      />

      {/* Payment Options */}
      <PaymentOptions onPurchase={handlePurchase} />

      {/* FAQ Section */}
      <PaymentFAQ />

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={signOut}>
        <View style={styles.logoutButtonContent}>
          <LogOut size={18} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>{t("common.logout")}</Text>
        </View>
      </Pressable>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>{t("common.processing")}</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {renderUserView()}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    minHeight: "100%",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Quicksand-Bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: "Quicksand-Regular",
    color: "#333",
    minHeight: 52,
  },
  fieldErrorText: {
    color: "#FF3B30",
    fontSize: 12,
    fontFamily: "Quicksand-Medium",
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 12,
  },
  button: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
  },
  switchButton: {
    alignItems: "center",
    padding: 12,
  },
  switchButtonText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontFamily: "Quicksand-Medium",
    textAlign: "center",
  },
  preferencesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  preferencesButtonText: {
    marginLeft: 8,
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 16,
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Nunito-Bold",
    color: "#333",
    marginBottom: 20,
  },
  historyList: {
    width: "100%",
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyHistoryText: {
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#666",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  loadingText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#333",
    marginTop: 12,
  },
});

function purchaseCredits(creditAmount: number, arg1: boolean) {
  throw new Error("Function not implemented.");
}

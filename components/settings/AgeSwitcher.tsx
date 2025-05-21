import Button from "@/components/ui/Button";
import { AgeRange } from "@/constants/Settings";
import { storeAge } from "@/lib/settings";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from "react-native-reanimated";

// Age-specific icons and illustrations
const ageIcons: Record<string, { icon: string; color: string }> = {
  "under-3": {
    icon: "👶",
    color: "#FFB6C1", // Light pink
  },
  "3-5": {
    icon: "🧒",
    color: "#FFD700", // Gold
  },
  "6-9": {
    icon: "👦",
    color: "#87CEFA", // Light sky blue
  },
  "10-15": {
    icon: "🧑",
    color: "#98FB98", // Pale green
  },
  "16-plus": {
    icon: "🧓",
    color: "#DDA0DD", // Light purple
  },
};

// Fun animal companions for each age group
const ageAnimals: Record<string, string> = {
  "under-3": "🐣", // Baby chick
  "3-5": "🐶", // Puppy
  "6-9": "🐱", // Kitten
  "10-15": "🦊", // Fox
  "16-plus": "🦉", // Owl
};

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "under-3", label: "settings.age.ranges.under-3" },
  { value: "3-5", label: "settings.age.ranges.3-5" },
  { value: "6-9", label: "settings.age.ranges.6-9" },
  { value: "10-15", label: "settings.age.ranges.10-15" },
  { value: "16-plus", label: "settings.age.ranges.16-plus" },
];

export function AgeSwitcher() {
  const { t } = useTranslation();
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(null);
  const router = useRouter();

  const handleAgeChange = async (value: AgeRange) => {
    try {
      setSelectedAge(value);
      await storeAge(value);
    } catch (error) {
      console.error("Error changing age:", error);
    }
  };

  const handleClose = () => {
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.push("/");
    }
  };

  const confirmAge = async () => {
    if (!selectedAge) {
      Alert.alert(
        t("settings.age.missing.title"),
        t("settings.age.missing.message"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
        ]
      );
      return;
    }
    handleClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.ageContainer}>
        <View style={styles.ageGrid}>
          {Object.entries(AGE_RANGES).map(([value, range], index) => {
            const isSelected = range.value === selectedAge;
            const ageInfo = ageIcons[range.value];
            const scale = useSharedValue(1);

            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: scale.value }],
              };
            });

            return (
              <Animated.View
                key={value}
                entering={ZoomIn.delay(index * 150).springify()}
                style={[styles.ageButtonContainer, animatedStyle]}
              >
                <Pressable
                  style={[
                    styles.ageButton,
                    isSelected && styles.selectedAge,
                    { backgroundColor: isSelected ? ageInfo.color : "#F8F8F8" },
                  ]}
                  onPress={() => handleAgeChange(range.value as AgeRange)}
                  onPressIn={() => {
                    scale.value = withSpring(0.9);
                  }}
                  onPressOut={() => {
                    scale.value = withSpring(1.05, {}, () => {
                      scale.value = withSpring(1);
                    });
                  }}
                >
                  <Text style={styles.ageEmoji}>{ageInfo.icon}</Text>
                  <Text
                    style={[styles.ageName, isSelected && styles.selectedText]}
                  >
                    {t(range.label)}
                  </Text>

                  {isSelected && (
                    <Animated.View
                      entering={FadeInDown.springify()}
                      style={styles.animalContainer}
                    >
                      <Text style={styles.animalEmoji}>
                        {ageAnimals[value]}
                      </Text>
                    </Animated.View>
                  )}

                  {isSelected && (
                    <View style={styles.starBadge}>
                      <Text style={styles.starText}>★</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="primary"
          label={t("common.confirm")}
          onPress={confirmAge}
          icon={
            <FontAwesome
              name="check"
              size={18}
              color="#25292e"
              style={styles.buttonIcon}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  ageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  ageButtonContainer: {
    width: "30%",
    maxWidth: 160,
    marginBottom: 16,
  },
  ageButton: {
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  selectedAge: {
    borderColor: "#FFD166",
    borderWidth: 4,
  },
  flagImage: {
    width: 80,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  ageName: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: "#333",
    textAlign: "center",
  },
  selectedText: {
    color: "#333",
    fontSize: 18,
  },
  starBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  starText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  animalContainer: {
    position: "absolute",
    top: -5,
    left: -10,
  },
  animalEmoji: {
    fontSize: 28,
    transform: [{ rotate: "-20deg" }],
  },
  ageEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  buttonIcon: {
    paddingRight: 8,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

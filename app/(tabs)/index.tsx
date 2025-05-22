import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StoryCreatorTab() {
  const { t } = useTranslation();

  const startRecognition = async () => {
    try {
    } catch (err) {
      console.error("Recognition start error:", err);
    }
  };


  const buyCredits = async () => {};

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.creditContainer}>
          <Pressable onPress={buyCredits}>
            <FontAwesome name="diamond" size={30} />
          </Pressable>
          <Text>5 more free stories</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.actionContainer}>
          <Pressable onPress={startRecognition}>
            <FontAwesome name="microphone" size={120} />
          </Pressable>
          <Text>{t("creator.speech.tapToStart")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    position: "absolute",
    top: 10,
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  contentContainer: {},
  actionContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  creditContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  circleButtonContainer: {
    width: 45,
    height: 45,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: "#ffd33d",
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});

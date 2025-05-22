import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface HeaderAccountButtonProps {
  visible: boolean;
}

export default function HeaderAccountButton({ visible }: HeaderAccountButtonProps) {
  const router = useRouter();

  const openAccount = () => {
    router.push("/account");
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.circleButtonContainer}>
        <Pressable style={styles.circleButton} onPress={openAccount}>
          <FontAwesome name="user-circle" size={42} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 10,
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end", // Changed to flex-end to position on top right
    zIndex: 10, // Ensure it's above other content
  },
  circleButtonContainer: {
    width: 45,
    height: 45,
    marginHorizontal: 20, // Adjusted margin
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

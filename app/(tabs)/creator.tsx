import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import {
  AVAudioSessionCategory,
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function StoryCreatorTab() {
  const { t } = useTranslation();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [story, setStory] = useState<{ soundUrl: string; imageUrl: string; text: string } | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const [volume, setVolume] = useState(1.0);
  const volumeLevels = [0.2, 0.5, 1.0];
  const [volumeIndex, setVolumeIndex] = useState(2);
  const scale = useSharedValue(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    if (isModalVisible && story) {
      const playSound = async () => {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
          });
          await sound.current.loadAsync({ uri: story.soundUrl });
          await sound.current.setVolumeAsync(volume);
          await sound.current.playAsync();
          setPlaybackStatus('playing');
        } catch (e) {
          console.error(e);
        }
      };
      playSound();
    }
  }, [isModalVisible, story]);

  useEffect(() => {
    if (isRecognizing) {
      scale.value = withRepeat(
        withTiming(1.2, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
    }
  }, [isRecognizing, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useSpeechRecognitionEvent("start", () => {
    setIsRecognizing(true);
    setTranscribedText("");
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsRecognizing(false);
    if (!transcribedText.trim()) {
      setError(t("creator.speech.noSpeechDetected"));
      return;
    }
    setIsProcessing(true);
    const timeoutId = setTimeout(() => {
      callApiWithText(transcribedText);
    }, 500);

    return () => clearTimeout(timeoutId);
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (event.results && event.results.length > 0) {
      setTranscribedText(event.results[0]?.transcript ?? "");
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setError(event.error ?? "An unknown error occurred");
    setIsRecognizing(false);
  });

  const handleErrorPress = () => {
    setError(null);
    startRecognition();
  };

  const startRecognition = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const permissions = await ExpoSpeechRecognitionModule.getPermissionsAsync();
    if (!permissions.granted) {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert(
          t("creator.permissions.title"),
          t("creator.permissions.message")
        );
        return;
      }
    }

    ExpoSpeechRecognitionModule.start({
      lang: "fr-FR",
      interimResults: true,
      continuous: false,
      iosCategory: {
        category: AVAudioSessionCategory.playAndRecord,
        categoryOptions: [],
      },
    });
  };

  const handleModalClose = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
    }
    setIsModalVisible(false);
    setPlaybackStatus('stopped');
  };

  const stopRecognition = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isRecognizing) {
      ExpoSpeechRecognitionModule.stop();
    } else if (isProcessing) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsProcessing(false);
    }
  };

  const callApiWithText = async (text: string) => {
    abortControllerRef.current = new AbortController();
    try {
      // Mocking a successful API response for demonstration
      const mockApiResponse = {
        soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        imageUrl: "https://picsum.photos/seed/picsum/200/300",
        text: t("creator.story.mockText"),
      };
      setStory(mockApiResponse);
      setIsModalVisible(true);
      // const response = await fetch("https://api.example.com/process", {
      //   method: "POST",
      //   signal: abortControllerRef.current.signal,
      //   body: JSON.stringify({ text }),
      //   headers: { "Content-Type": "application/json" },
      // });
      // if (!response.ok) {
      //   throw new Error("API call failed");
      // }
      // const data = await response.json();
      // setStory(data);
      // setIsModalVisible(true);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('API call aborted');
      } else {
        setError(t("creator.error.apiCallFailed"));
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const buyCredits = async () => {};

  const getMicrophoneIcon = () => {
    if (error) {
      return { name: 'exclamation-triangle' as const, color: '#FF8E53', size: 60 };
    }
    if (isProcessing) {
      return { name: 'stop' as const, color: '#333', size: 60 };
    }
    if (isRecognizing) {
      return { name: 'microphone' as const, color: '#FF6B6B', size: 120 };
    }
    return { name: 'microphone' as const, color: '#333', size: 120 };
  };

  const getStatusText = () => {
    if (error) {
      return `${t("common.error")}: ${error}`;
    }
    if (isProcessing) {
      return t("creator.status.processing");
    }
    if (isRecognizing) {
      return t("creator.status.listening");
    }
    return t("creator.speech.tapToStart");
  };

  const micIcon = getMicrophoneIcon();
  const isDisabled = false;

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <FontAwesome name="close" size={30} color="#333" />
            </Pressable>
            {story && (
              <>
                <View style={styles.storyImageContainer}>
                  <Image source={{ uri: story.imageUrl }} style={styles.storyImage} />
                  <View style={styles.audioControls}>
                    <Pressable style={styles.audioButton} onPress={async () => {
                      await sound.current.replayAsync();
                      setPlaybackStatus('playing');
                    }}>
                      <FontAwesome name="repeat" size={40} color="#fff" />
                    </Pressable>
                    <Pressable style={styles.audioButton} onPress={async () => {
                      if (playbackStatus === 'playing') {
                        await sound.current.pauseAsync();
                        setPlaybackStatus('paused');
                      } else {
                        await sound.current.playAsync();
                        setPlaybackStatus('playing');
                      }
                    }}>
                      <FontAwesome name={playbackStatus === 'playing' ? 'pause-circle-o' : 'play-circle-o'} size={80} color="#fff" />
                    </Pressable>
                    <Pressable style={styles.audioButton} onPress={() => {
                      const newIndex = (volumeIndex + 1) % volumeLevels.length;
                      const newVolume = volumeLevels[newIndex];
                      setVolumeIndex(newIndex);
                      setVolume(newVolume);
                      sound.current.setVolumeAsync(newVolume);
                    }}>
                      <FontAwesome name="volume-up" size={40} color="#fff" />
                      <Text style={styles.volumeText}>{Math.round(volume * 100)}%</Text>
                    </Pressable>
                  </View>
                </View>
                <ScrollView style={styles.storyScrollView}>
                  <Text style={styles.storyText}>{story.text}</Text>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
      <View style={styles.headerContainer}>
        <View style={styles.creditContainer}>
          <Pressable onPress={buyCredits}>
            <FontAwesome name="diamond" size={30} />
          </Pressable>
          <Text>{t("creator.credits.freeStories", { count: 5 })}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.actionContainer}>
          <View style={styles.micContainer}>
            {isProcessing && (
              <ActivityIndicator size={160} color="#FF6B6B" style={styles.spinner} />
            )}
            <Animated.View style={[isRecognizing && animatedStyle]}>
              <Pressable
                onPress={error ? handleErrorPress : (isRecognizing || isProcessing ? stopRecognition : startRecognition)}
                disabled={isDisabled}
                style={[
                  styles.microphoneButton,
                  isRecognizing && styles.listeningButton,
                  isProcessing && styles.processingButton,
                ]}
              >
                {error && (
                  <View style={styles.errorIconContainer}>
                    <FontAwesome name="repeat" size={120} color="#FF8E53" style={styles.retryIcon} />
                    <FontAwesome
                      name={micIcon.name}
                      size={micIcon.size}
                      color={micIcon.color}
                    />
                  </View>
                )}
                {!error && (
                  <FontAwesome
                    name={micIcon.name}
                    size={micIcon.size}
                    color={micIcon.color}
                  />
                )}
              </Pressable>
            </Animated.View>
          </View>

          <Text style={[
            styles.statusText,
            isRecognizing && styles.listeningText,
            error && styles.errorText
          ]}>
            {getStatusText()}
          </Text>

          {transcribedText ? (
            <View style={styles.transcriptionContainer}>
              <Text style={styles.transcriptionLabel}>{t("creator.transcription.label")}</Text>
              <Text style={styles.transcriptionText}>"{transcribedText}"</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '100%',
    height: '75%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  storyImageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  audioControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  audioButton: {
    alignItems: 'center',
  },
  volumeText: {
    color: '#fff',
    marginTop: 5,
  },
  storyScrollView: {
    flex: 1,
    marginTop: 20,
  },
  storyText: {
    fontSize: 18,
    textAlign: 'center',
  },
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    justifyContent: 'center',
  },
  micContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  spinner: {
    position: 'absolute',
  },
  creditContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  microphoneButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'transparent',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  processingButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryIcon: {
    position: 'absolute',
  },
  disabledButton: {
    opacity: 0.6,
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listeningText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF8E53',
  },
  transcriptionContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    maxWidth: '90%',
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  transcriptionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  transcriptionText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  permissionWarningText: {
    marginLeft: 8,
    color: '#856404',
    fontSize: 14,
  },
  spinningIcon: {
    // Note: For a proper spinning animation, you'd want to use react-native-reanimated
    // This is a placeholder for the spinning effect
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

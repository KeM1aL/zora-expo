import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StoryModalProps {
  visible: boolean;
  selectedStory: {
    id: string;
    image: string;
    description: string;
    isLoved: boolean;
  } | null;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ visible, selectedStory, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          {selectedStory && (
            <>
              <View style={modalStyles.imageContainer}>
                <Image source={{ uri: selectedStory.image }} style={modalStyles.modalImage} />
                <View style={modalStyles.playButtonOverlay}>
                  <TouchableOpacity style={modalStyles.playButton}>
                    <Ionicons name="play-circle" size={60} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={modalStyles.modalDescriptionScroll}>
                <Text style={modalStyles.modalTitle}>Title</Text>
                <Text style={modalStyles.modalDescriptionText}>{selectedStory.description}</Text>
                <Text style={modalStyles.modalDescriptionText}>{selectedStory.description}</Text>
                <Text style={modalStyles.modalDescriptionText}>{selectedStory.description}</Text>
                <Text style={modalStyles.modalDescriptionText}>{selectedStory.description}</Text>
                <Text style={modalStyles.modalDescriptionText}>{selectedStory.description}</Text>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 50,
    height: '90%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent overlay
  },
  playButton: {
    // No specific styles needed here, as the icon itself provides the size and color
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescriptionScroll: {
    flex: 1,
    width: '90%',
    paddingHorizontal: 10,
  },
  modalDescriptionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default StoryModal;

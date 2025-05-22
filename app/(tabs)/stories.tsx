import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StoryModal from "../../components/StoryModal";

const initialStoriesData = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/story1/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/story2/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/story3/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/story4/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '5',
    image: 'https://picsum.photos/seed/story3/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '6',
    image: 'https://picsum.photos/seed/story4/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '7',
    image: 'https://picsum.photos/seed/story3/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
  {
    id: '8',
    image: 'https://picsum.photos/seed/story4/150/100', // Reliable placeholder image
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved: false,
  },
];

export default function StoryDashboardTab() {
  const [stories, setStories] = useState(initialStoriesData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<typeof initialStoriesData[0] | null>(null);

  const handleBuyNewStories = () => {
    console.log("Buy new stories clicked!");
    // Implement navigation or other action here
  };

  const handleStoryPress = (story: typeof initialStoriesData[0]) => {
    setSelectedStory(story);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
  };

  const handleLoveStory = (id: string) => {
    setStories((prevStories: typeof initialStoriesData) =>
      prevStories.map((story: typeof initialStoriesData[0]) =>
        story.id === id ? { ...story, isLoved: !story.isLoved } : story
      )
    );
  };

  const renderStoryItem = ({ item }: { item: typeof initialStoriesData[0] }) => (
    <TouchableOpacity style={styles.storyItem} onPress={() => handleStoryPress(item)}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <Text style={styles.storyDescription}>{item.description}</Text>
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => handleLoveStory(item.id)}
        >
          <AntDesign
            name={item.isLoved ? "heart" : "hearto"}
            size={20}
            color={item.isLoved ? "red" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => console.log("Share button clicked for story:", item.id)}
        >
          <AntDesign name="sharealt" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buyStoriesContainer} onPress={handleBuyNewStories}>
        <View style={styles.plusIconContainer}>
          <AntDesign name="plus" size={30} color="black" />
        </View>
        <Text style={styles.buyStoriesText}>Buy new stories</Text>
      </TouchableOpacity>

      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.storiesGrid}
      />

      <StoryModal
        visible={modalVisible}
        selectedStory={selectedStory}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  buyStoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  plusIconContainer: {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'dotted',
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
  },
  buyStoriesText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storiesGrid: {
    justifyContent: 'space-between',
  },
  storyItem: {
    width: '48%', // Roughly half the width, accounting for spacing
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: '1%', // Add some horizontal margin for spacing
  },
  storyImage: {
    width: '100%',
    height: 100,
    borderRadius: 4,
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 12,
    color: '#555',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  heartButton: {
    padding: 5,
  },
  shareButton: {
    padding: 5,
  },
});

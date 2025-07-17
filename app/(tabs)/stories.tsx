import { AntDesign } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StoryModal from "../../components/StoryModal";
import { useStories, useStoriesPaginated, useUpdateStoryLoved } from "../../hooks/useStories";
import { Story } from "../../services/storiesApi";

import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');
const isTabletOrDesktop = screenWidth >= 768; // Consider tablet/desktop if width >= 768px

export default function StoryDashboardTab() {
  const { t } = useTranslation();
  const { data: allStories, isLoading: allStoriesLoading, error: allStoriesError } = useStories();
  const { 
    data: paginatedData, 
    isLoading: paginatedLoading, 
    error: paginatedError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useStoriesPaginated(10);
  
  const updateStoryMutation = useUpdateStoryLoved();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const lovedStoriesRef = useRef<FlatList>(null);

  // Get loved stories for horizontal section
  const lovedStories = useMemo(() => {
    return allStories?.filter(story => story.isLoved) || [];
  }, [allStories]);

  // Flatten paginated stories for vertical section
  const paginatedStories = useMemo(() => {
    if (!paginatedData) return [];
    return (paginatedData as any).pages?.flatMap((page: any) => page.stories) || [];
  }, [paginatedData]);

  const handleBuyNewStories = () => {
    console.log("Buy new stories clicked!");
    // Implement navigation or other action here
  };

  const handleStoryPress = (story: Story) => {
    setSelectedStory(story);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
  };

  const handleLoveStory = (id: string) => {
    const story = allStories?.find((s: Story) => s.id === id) || paginatedStories.find((s: Story) => s.id === id);
    if (story) {
      updateStoryMutation.mutate({ id, isLoved: !story.isLoved });
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Carousel navigation functions for tablet/desktop
  const itemsPerPage = isTabletOrDesktop ? Math.floor((screenWidth - 32) / 152) : 1; // 152 = 140 (item width) + 12 (margin)
  const totalPages = Math.ceil(lovedStories.length / itemsPerPage);

  const handlePrevCarousel = () => {
    if (currentCarouselIndex > 0) {
      const newIndex = currentCarouselIndex - 1;
      setCurrentCarouselIndex(newIndex);
      const scrollOffset = newIndex * itemsPerPage * 152; // 152 = item width + margin
      lovedStoriesRef.current?.scrollToOffset({
        offset: scrollOffset,
        animated: true,
      });
    }
  };

  const handleNextCarousel = () => {
    if (currentCarouselIndex < totalPages - 1) {
      const newIndex = currentCarouselIndex + 1;
      setCurrentCarouselIndex(newIndex);
      const scrollOffset = newIndex * itemsPerPage * 152; // 152 = item width + margin
      lovedStoriesRef.current?.scrollToOffset({
        offset: scrollOffset,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    if (isTabletOrDesktop) {
      const scrollOffset = event.nativeEvent.contentOffset.x;
      const currentPage = Math.round(scrollOffset / (itemsPerPage * 152));
      if (currentPage !== currentCarouselIndex && currentPage >= 0 && currentPage < totalPages) {
        setCurrentCarouselIndex(currentPage);
      }
    }
  };

  const renderLovedStoryItem = ({ item }: { item: Story }) => (
    <TouchableOpacity style={styles.lovedStoryItem} onPress={() => handleStoryPress(item)}>
      <Image source={{ uri: item.image }} style={styles.lovedStoryImage} />
      <Text style={styles.lovedStoryDescription} numberOfLines={2}>{item.description}</Text>
      <TouchableOpacity
        style={styles.lovedHeartButton}
        onPress={() => handleLoveStory(item.id)}
      >
        <AntDesign name="heart" size={16} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderStoryItem = ({ item }: { item: Story }) => (
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

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={styles.loadingMoreText}>Loading more stories...</Text>
      </View>
    );
  };

  if (allStoriesLoading || paginatedLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    );
  }

  if (allStoriesError || paginatedError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load stories</Text>
        <Text style={styles.errorSubText}>Please try again later</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buyStoriesContainer} onPress={handleBuyNewStories}>
        <View style={styles.plusIconContainer}>
          <AntDesign name="plus" size={30} color="black" />
        </View>
        <Text style={styles.buyStoriesText}>{t('stories.buyNew')}</Text>
      </TouchableOpacity>

      {/* First Section: Horizontal Loved Stories */}
      <View style={styles.lovedStoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Loved Stories</Text>
          {isTabletOrDesktop && lovedStories.length > itemsPerPage && (
            <View style={styles.carouselControls}>
              <TouchableOpacity
                style={[styles.carouselButton, currentCarouselIndex === 0 && styles.carouselButtonDisabled]}
                onPress={handlePrevCarousel}
                disabled={currentCarouselIndex === 0}
              >
                <AntDesign name="left" size={16} color={currentCarouselIndex === 0 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              <View style={styles.carouselIndicators}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.carouselDot,
                      index === currentCarouselIndex && styles.carouselDotActive
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={[styles.carouselButton, currentCarouselIndex === totalPages - 1 && styles.carouselButtonDisabled]}
                onPress={handleNextCarousel}
                disabled={currentCarouselIndex === totalPages - 1}
              >
                <AntDesign name="right" size={16} color={currentCarouselIndex === totalPages - 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {lovedStories.length > 0 ? (
          <FlatList
            ref={lovedStoriesRef}
            data={lovedStories}
            renderItem={renderLovedStoryItem}
            keyExtractor={(item) => `loved-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lovedStoriesContainer}
            scrollEnabled={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={isTabletOrDesktop ? itemsPerPage * 152 : undefined}
            snapToAlignment="start"
            decelerationRate={isTabletOrDesktop ? "fast" : "normal"}
          />
        ) : (
          <View style={styles.emptyLovedStories}>
            <Text style={styles.emptyText}>No loved stories yet</Text>
            <Text style={styles.emptySubText}>Heart some stories to see them here</Text>
          </View>
        )}
      </View>

      {/* Second Section: Vertical Paginated Stories */}
      <View style={styles.allStoriesSection}>
        <Text style={styles.sectionTitle}>All Stories</Text>
        <FlatList
          data={paginatedStories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => `paginated-${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.storiesGrid}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      </View>

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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
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
  
  // Loved Stories Section
  lovedStoriesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  carouselControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carouselButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  carouselButtonDisabled: {
    backgroundColor: '#f8f8f8',
  },
  carouselIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 2,
  },
  carouselDotActive: {
    backgroundColor: '#333',
  },
  lovedStoriesContainer: {
    paddingHorizontal: 4,
  },
  lovedStoryItem: {
    width: 140,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  lovedStoryImage: {
    width: '100%',
    height: 80,
    borderRadius: 4,
    marginBottom: 6,
  },
  lovedStoryDescription: {
    fontSize: 11,
    color: '#555',
    marginBottom: 6,
    minHeight: 32,
  },
  lovedHeartButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  emptyLovedStories: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },

  // All Stories Section
  allStoriesSection: {
    flex: 1,
  },
  storiesGrid: {
    justifyContent: 'space-between',
  },
  storyItem: {
    width: '48%',
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
    marginHorizontal: '1%',
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
  
  // Footer loader
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

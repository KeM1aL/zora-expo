export interface Story {
  id: string;
  image: string;
  description: string;
  isLoved: boolean;
}

export interface PaginatedStoriesResponse {
  stories: Story[];
  hasNextPage: boolean;
  totalCount: number;
}

// Generate mock stories data
const generateMockStories = (count: number): Story[] => {
  const stories: Story[] = [];
  for (let i = 1; i <= count; i++) {
    stories.push({
      id: i.toString(),
      image: `https://picsum.photos/seed/story${i}/150/100`,
      description: `Story ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut commodo sagittis, sapien dui mattis dui, non pulvinar lorem felis nec erat.`,
      isLoved: Math.random() > 0.7, // Random loved status, roughly 30% loved
    });
  }
  return stories;
};

// Mock data - replace with actual API call
const ALL_MOCK_STORIES = generateMockStories(50); // Generate 50 stories for testing

// Mock API function - replace with your actual API endpoint
export const fetchStories = async (): Promise<Story[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return ALL_MOCK_STORIES;
};

// Paginated stories API function
export const fetchStoriesPaginated = async (page: number = 1, limit: number = 10): Promise<PaginatedStoriesResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedStories = ALL_MOCK_STORIES.slice(startIndex, endIndex);
  
  return {
    stories: paginatedStories,
    hasNextPage: endIndex < ALL_MOCK_STORIES.length,
    totalCount: ALL_MOCK_STORIES.length,
  };
};

// Function to update a story's loved status - replace with actual API call
export const updateStoryLoved = async (id: string, isLoved: boolean): Promise<Story> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock response - replace with actual API call
  return {
    id,
    image: `https://picsum.photos/seed/story${id}/150/100`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut ...',
    isLoved,
  };
};

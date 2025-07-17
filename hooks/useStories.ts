import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchStories, fetchStoriesPaginated, PaginatedStoriesResponse, Story, updateStoryLoved } from '../services/storiesApi';

export const useStories = () => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStoriesPaginated = (limit: number = 10) => {
  return useInfiniteQuery<PaginatedStoriesResponse, Error, PaginatedStoriesResponse, (string | number)[], number>({
    queryKey: ['stories-paginated', limit],
    queryFn: ({ pageParam = 1 }) => fetchStoriesPaginated(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateStoryLoved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLoved }: { id: string; isLoved: boolean }) =>
      updateStoryLoved(id, isLoved),
    onMutate: async ({ id, isLoved }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['stories'] });
      await queryClient.cancelQueries({ queryKey: ['stories-paginated'] });

      // Snapshot the previous value
      const previousStories = queryClient.getQueryData<Story[]>(['stories']);

      // Optimistically update to the new value
      queryClient.setQueryData<Story[]>(['stories'], (old) =>
        old?.map((story) =>
          story.id === id ? { ...story, isLoved } : story
        ) || []
      );

      // Update paginated stories as well
      queryClient.setQueriesData<{ pages: PaginatedStoriesResponse[]; pageParams: number[] }>({ queryKey: ['stories-paginated'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: PaginatedStoriesResponse) => ({
            ...page,
            stories: page.stories.map((story: Story) =>
              story.id === id ? { ...story, isLoved } : story
            ),
          })),
        };
      });

      // Return a context object with the snapshotted value
      return { previousStories };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousStories) {
        queryClient.setQueryData(['stories'], context.previousStories);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['stories-paginated'] });
    },
  });
};

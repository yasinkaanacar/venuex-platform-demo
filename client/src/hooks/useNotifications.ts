import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Notification } from '@/lib/types/notifications';

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });
}

export function useUnreadCount() {
  return useQuery<{ count: number }>({
    queryKey: ['/api/notifications/unread-count'],
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('PATCH', `/api/notifications/${id}/read`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });
}

export function useMarkAllAsRead() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/notifications/read-all');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    },
  });
}

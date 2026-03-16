import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/hooks/query-keys';
import type { Notification } from '@/lib/types/notifications';

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
  });
}

export function useUnreadCount() {
  return useQuery<{ count: number }>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('PATCH', `/api/notifications/${id}/read`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
    },
  });
}

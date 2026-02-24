import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockDataService } from './mockData';
import { segmentDataService } from './mock-segments-data';
import { notificationDataService } from './mock-notifications-data';

// Mock API request function that simulates backend responses  
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Simulate the response structure but use mock data
  const response = await handleMockRequest(method, url, data);
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle mock requests based on URL patterns
async function handleMockRequest(method: string, url: string, data?: unknown) {
  // Notification endpoints (order: most specific first)
  if (url.includes('/api/notifications/read-all') && method.toUpperCase() === 'POST') {
    return await notificationDataService.markAllAsRead();
  }
  if (url.includes('/api/notifications/') && url.includes('/read') && method.toUpperCase() === 'PATCH') {
    const parts = url.split('/');
    const id = parts[parts.indexOf('notifications') + 1];
    return await notificationDataService.markAsRead(id);
  }
  if (url.includes('/api/notifications/unread-count')) {
    return await notificationDataService.getUnreadCount();
  }
  if (url.includes('/api/notifications')) {
    return await notificationDataService.getNotifications();
  }

  if (url.includes('/api/overview')) {
    return await mockDataService.getOverviewData();
  }
  
  if (url.includes('/api/enrichment-suggestions')) {
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const platformId = urlParams.get('platformId') || undefined;
    return await mockDataService.getEnrichmentSuggestions(platformId);
  }
  
  if (url.includes('/api/enrichment-suggestions/') && method.toUpperCase() === 'PATCH') {
    const id = url.split('/').pop();
    if (id && data) {
      return await mockDataService.updateEnrichmentSuggestion(id, data as any);
    }
  }
  
  if (url.includes('/api/alerts/') && method.toUpperCase() === 'DELETE') {
    const id = url.split('/').pop();
    if (id) {
      return await mockDataService.dismissAlert(id);
    }
  }
  
  // Segment endpoints (order matters — more specific first)
  if (url.includes('/api/segments/summary')) {
    return await mockDataService.getSegmentSummary();
  }
  if (url.includes('/api/segments/feed-labels')) {
    return await mockDataService.getFeedLabels();
  }
  if (url.includes('/api/segments/exports/scheduled')) {
    return await mockDataService.getScheduledExports();
  }
  if (url.includes('/api/segments/exports')) {
    return await mockDataService.getExports();
  }
  if (url.includes('/api/segments/push-log')) {
    return await mockDataService.getPushLog();
  }
  if (url.includes('/api/segments/automation/')) {
    const segId = url.split('/').pop()!;
    return await segmentDataService.getAutomationRules(segId);
  }
  if (url.includes('/api/segments/reach-projection/')) {
    const parts = url.split('/');
    const platform = parts.pop()!;
    const segId = parts.pop()!;
    return await segmentDataService.getReachProjection(segId, platform as any);
  }
  if (url.includes('/api/segments/overlap')) {
    return await mockDataService.getTopOverlaps();
  }
  if (url.includes('/api/segments/lookalikes')) {
    return await mockDataService.getLookalikeAudiences();
  }
  if (url.includes('/api/segments/ab-tests')) {
    return await mockDataService.getABTests();
  }
  if (url.includes('/api/segments/attribution/timeseries')) {
    const segId = url.split('/').pop();
    return await mockDataService.getAttributionTimeseries(segId ?? '');
  }
  if (url.includes('/api/segments/attribution')) {
    return await mockDataService.getSegmentAttributions();
  }
  if (url.includes('/api/segments/performance/detail/')) {
    const parts = url.split('/');
    const period = parts.pop()!;
    const segId = parts.pop()!;
    return await segmentDataService.getPerformanceDetail(segId, period as any);
  }
  if (url.includes('/api/segments/performance/summaries')) {
    return await segmentDataService.getPerformanceSummaries();
  }
  if (url.includes('/api/segments')) {
    return await mockDataService.getSegments();
  }

  // Default response for unhandled endpoints
  return { success: true };
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    // Use mock data instead of fetch
    const response = await handleMockRequest('GET', url);
    return response as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

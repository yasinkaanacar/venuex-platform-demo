import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { resolveEndpoint } from './api-config';

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

// Handle mock requests by dispatching through the API registry
async function handleMockRequest(method: string, url: string, data?: unknown) {
  const match = resolveEndpoint(method, url);
  if (match) {
    return await match.handler(url, data);
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

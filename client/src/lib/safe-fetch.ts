/**
 * FullStory-safe fetch wrapper
 * Prevents tracking script interference with API calls
 */

const originalFetch = window.fetch;

export const safeFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  try {
    // Try the original fetch first
    return await originalFetch(input, init);
  } catch (error) {
    // If it's a FullStory interference error, try again with a clean fetch
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      console.debug(
        "FullStory interference detected, retrying with clean fetch",
      );

      // Create a clean fetch call bypassing FullStory
      const cleanFetch = originalFetch.bind(window);
      return await cleanFetch(input, init);
    }

    // Re-throw non-FullStory errors
    throw error;
  }
};

// Export as default for easy importing
export default safeFetch;

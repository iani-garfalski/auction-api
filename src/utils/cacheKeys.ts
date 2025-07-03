// Generates a unique cache key for an individual auction item by ID.
// Used for GET /items/:id caching.
export const getItemKey = (id: number) => `item:${id}`;

// Generates a cache key for paginated lists of auction items.
// Used in GET /items?page=x&limit=y caching.
export const getItemsPageKey = (page: number, limit: number) => `items:page=${page}:limit=${limit}`;

// Generates a cache key for search results by query string.
// Used for GET /search?q=term caching.
export const getSearchKey = (q: string) => `search:${q}`;

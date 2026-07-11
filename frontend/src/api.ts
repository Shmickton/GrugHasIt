const API_BASE_URL = "http://127.0.0.1:3000";

export type Listing = {
    listingId: number;
    userId: number;
    userName: string;
    title: string;
    desc: string;
    cost: number;
};

type ApiErrorResponse = {
    error?: string;
    message?: string;
};

async function apiRequest<T>(
    path: string,
    options: { method?: string; body?: Record<string, unknown> } = {}
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method ?? "GET",
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        const errData = data as ApiErrorResponse;
        throw new Error(errData.message ?? errData.error ?? `Request failed with status ${res.status}`);
    }

    return data as T;
}

// Empty query returns every listing; a non-empty query filters by title (server-side).
export function searchListings(query: string): Promise<Listing[]> {
    const params = query ? `?q=${encodeURIComponent(query)}` : "";
    return apiRequest<Listing[]>(`/listing/search${params}`);
}

export function createListing(
    userId: number,
    listing: { title: string; desc: string; cost: number }
): Promise<{ listingId: number }> {
    return apiRequest<{ listingId: number }>(`/listing/${userId}/create`, {
        method: "POST",
        body: listing,
    });
}

export function removeListing(userId: number, listingId: number): Promise<Listing | null> {
    return apiRequest<Listing | null>(`/listing/${userId}/remove/${listingId}`, {
        method: "DELETE",
    });
}

export function updateListing(
    userId: number,
    listingId: number,
    listing: { title: string; desc: string; cost: number }
): Promise<Listing> {
    return apiRequest<Listing>(`/listing/${userId}/update/${listingId}`, {
        method: "PUT",
        body: listing,
    });
}
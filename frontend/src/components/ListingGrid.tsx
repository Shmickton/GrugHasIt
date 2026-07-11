import { useState, useEffect } from "react";
import ListingSearchBar from "./ListingSearchBar";
import { searchListings, type Listing } from "../api";

// ---------------------------------------------
// Palette (workshop / hardware-store tag theme)
// ---------------------------------------------
const COLORS = {
    ink: "#22282B",
    steel: "#3E5C68",
    canvas: "#F3EFE6",
    card: "#FBF8F1",
    yellow: "#F5B700",
    rust: "#B5502C",
    olive: "#5B7553",
    line: "#D8D0BC",
};

function ListingTile({ listing }: { listing: Listing }) {
    return (
        <div
            className="relative rounded-sm transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1 cursor-pointer"
            style={{ filter: "drop-shadow(0 3px 6px rgba(34,40,43,0.18))" }}
        >
            <div
                className="rounded-sm overflow-hidden border"
                style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
            >
                {/* image block */}
                <div className="relative h-32" style={{ backgroundColor: COLORS.steel }}>
                    <img
                        src={`https://picsum.photos/seed/listing-${listing.listingId}/400/300`}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />

                    <span
                        className="absolute top-2 right-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-sm font-semibold"
                        style={{ backgroundColor: COLORS.olive, color: COLORS.canvas }}
                    >
                        <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: COLORS.yellow }}
                        />
                        Available
                    </span>
                </div>

                {/* perforated stub divider */}
                <div className="h-0" style={{ borderTop: `2px dashed ${COLORS.line}` }} />

                {/* details */}
                <div className="p-3">
                    <h3
                        className="text-sm font-semibold leading-snug mb-1"
                        style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.01em" }}
                    >
                        {listing.title}
                    </h3>

                    {listing.desc && (
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: "#5C5648" }}>
                            {listing.desc}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: "#5C5648" }}>
                            {listing.userName}
                        </span>

                        <div
                            className="text-base font-bold px-2 py-0.5 -rotate-1"
                            style={{ color: COLORS.rust, fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            ${listing.cost}
                            <span className="text-[10px] font-medium" style={{ color: "#8C8574" }}>
                                /day
                            </span>
                        </div>
                    </div>

                    <button
                        className="mt-3 w-full text-xs font-semibold uppercase tracking-wide py-2 rounded-sm transition-colors"
                        style={{ backgroundColor: COLORS.steel, color: COLORS.canvas }}
                    >
                        Rent this
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ListingGrid() {
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Refetch from the server whenever the search query changes (debounced slightly
    // so we're not firing a request on every keystroke).
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(true);
            setError("");
            searchListings(query)
                .then(setListings)
                .catch((err) => setError(err instanceof Error ? err.message : "Failed to load listings."))
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div
            className="min-h-screen w-full py-8 px-4 sm:px-8"
            style={{
                backgroundColor: COLORS.canvas,
                backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(34,40,43,0.03) 28px)",
            }}
        >
            <div className="max-w-6xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                <ListingSearchBar query={query} onQueryChange={setQuery} resultCount={listings.length} />

                {isLoading ? (
                    <div className="text-center py-16 text-sm" style={{ color: "#8C8574" }}>
                        Loading listings...
                    </div>
                ) : error ? (
                    <div
                        className="text-center py-16 rounded-sm border border-dashed"
                        style={{ borderColor: COLORS.line, color: COLORS.rust }}
                    >
                        {error}
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                        {listings.map((listing) => (
                            <ListingTile key={listing.listingId} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="text-center py-16 rounded-sm border border-dashed"
                        style={{ borderColor: COLORS.line, color: "#8C8574" }}
                    >
                        No tools match that search. Try a different keyword.
                    </div>
                )}
            </div>
        </div>
    );
}
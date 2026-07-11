import { useState, useEffect } from "react";
import ListingSearchBar from "./ListingSearchBar";
import type { User } from "./Account";
import { createBorrow, removeBorrow, searchListings, type Listing } from "../api";

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

type ListingTileProps = {
    listing: Listing;
    user: User | null;
    onBorrow: (listing: Listing) => void;
    onReturn: (listing: Listing) => void;
    onNavigateToAccount: () => void;
    isPending: boolean;
};

function ListingTile({ listing, user, onBorrow, onReturn, onNavigateToAccount, isPending }: ListingTileProps) {
    const isBorrowed = listing.borrowStatus === "borrowed";
    const isBorrowedByCurrentUser = user?.userId === listing.borrowedBy;
    const isOwnListing = user?.userId === listing.userId;
    const statusLabel = isBorrowedByCurrentUser
        ? "Borrowed by you"
        : isOwnListing
        ? "Your listing"
        : isBorrowed
        ? `Borrowed by ${listing.borrowedByName ?? "someone else"}`
        : "Available";

    const handleClick = () => {
        if (!user) {
            onNavigateToAccount();
            return;
        }

        if (isBorrowedByCurrentUser && listing.borrowId) {
            onReturn(listing);
            return;
        }

        if (!isBorrowed && !isOwnListing) {
            onBorrow(listing);
        }
    };

    const buttonLabel = !user
        ? "Log in to borrow"
        : isBorrowedByCurrentUser
        ? "Return this"
        : isOwnListing
        ? "Your listing"
        : isBorrowed
        ? "Unavailable"
        : "Borrow this";
    const imageSrc = listing.imageSrc ?? `https://picsum.photos/seed/listing-${listing.listingId}/400/300`;

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
                        src={imageSrc}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />

                    <span
                        className="absolute top-2 right-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-sm font-semibold"
                        style={{ backgroundColor: isBorrowed ? COLORS.rust : COLORS.olive, color: COLORS.canvas }}
                    >
                        <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: COLORS.yellow }}
                        />
                        {statusLabel}
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
                        type="button"
                        disabled={isPending || (!user ? false : isBorrowed && !isBorrowedByCurrentUser) || isOwnListing}
                        onClick={handleClick}
                        className="mt-3 w-full text-xs font-semibold uppercase tracking-wide py-2 rounded-sm transition-colors disabled:opacity-60"
                        style={{ backgroundColor: COLORS.steel, color: COLORS.canvas }}
                    >
                        {isPending ? "Working..." : buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

type ListingGridProps = {
    user: User | null;
    onNavigateToAccount: () => void;
};

export default function ListingGrid({ user, onNavigateToAccount }: ListingGridProps) {
    const [query, setQuery] = useState("");
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [pendingListingId, setPendingListingId] = useState<number | null>(null);

    const fetchListings = async (searchQuery: string) => {
        setIsLoading(true);
        setError("");

        try {
            const results = await searchListings(searchQuery);
            setListings(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load listings.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBorrow = async (listing: Listing) => {
        if (!user) {
            onNavigateToAccount();
            return;
        }

        setPendingListingId(listing.listingId);
        setActionError("");
        try {
            await createBorrow(user.userId, listing.listingId);
            await fetchListings(query);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to borrow this listing.");
        } finally {
            setPendingListingId(null);
        }
    };

    const handleReturn = async (listing: Listing) => {
        if (!user || !listing.borrowId) {
            return;
        }

        setPendingListingId(listing.listingId);
        setActionError("");
        try {
            await removeBorrow(user.userId, listing.borrowId);
            await fetchListings(query);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Failed to return this listing.");
        } finally {
            setPendingListingId(null);
        }
    };

    // Refetch from the server whenever the search query changes (debounced slightly
    // so we're not firing a request on every keystroke).
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            void fetchListings(query);
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

                {actionError && (
                    <div
                        className="mb-4 text-sm font-semibold rounded-sm border border-dashed px-4 py-3"
                        style={{ borderColor: COLORS.line, color: COLORS.rust }}
                    >
                        {actionError}
                    </div>
                )}
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
                            <ListingTile
                                key={listing.listingId}
                                listing={listing}
                                user={user}
                                onBorrow={handleBorrow}
                                onReturn={handleReturn}
                                onNavigateToAccount={onNavigateToAccount}
                                isPending={pendingListingId === listing.listingId}
                            />
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
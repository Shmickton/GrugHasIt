import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { User } from "./Account";
import {
    createListing,
    removeBorrow as removeBorrowRequest,
    removeListing as removeListingRequest,
    searchListings,
    type Listing,
} from "../api";

const COLORS = {
    ink: "#22282B",
    steel: "#3E5C68",
    canvas: "#F3EFE6",
    card: "#FBF8F1",
    rust: "#B5502C",
    line: "#D8D0BC",
};

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

type MyListingsProps = {
    user: User | null;
    onNavigateToAccount: () => void;
};

function MyListings({ user, onNavigateToAccount }: MyListingsProps) {
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [cost, setCost] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [imageName, setImageName] = useState("");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadMyListings = async () => {
        if (!user) return;
        setIsLoading(true);
        setLoadError("");
        searchListings("")
            .then((all) => setAllListings(all))
            .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load your listings."))
            .finally(() => setIsLoading(false));
    };

    const myListings = allListings.filter((listing) => listing.userId === user?.userId);
    const borrowedListings = allListings.filter((listing) => listing.borrowedBy === user?.userId);

    const getListingImageSrc = (listing: Listing) =>
        listing.imageSrc ?? `https://picsum.photos/seed/listing-${listing.listingId}/96/96`;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            setImageSrc("");
            setImageName("");
            return;
        }

        if (!file.type.startsWith("image/")) {
            setFormError("Please choose an image file.");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_BYTES) {
            setFormError("Please choose an image smaller than 4 MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(typeof reader.result === "string" ? reader.result : "");
            setImageName(file.name);
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!user) return;

            setIsLoading(true);
            setLoadError("");
            searchListings("")
                .then((all) => setAllListings(all))
                .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load your listings."))
                .finally(() => setIsLoading(false));
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [user]);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setFormError("");

        const parsedCost = Number(cost);
        if (!title.trim() || !desc.trim() || Number.isNaN(parsedCost) || parsedCost <= 0) {
            setFormError("Please fill in a title, description, and a valid price per day.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createListing(user.userId, { title: title.trim(), desc: desc.trim(), cost: parsedCost, imageSrc: imageSrc || null });
            setTitle("");
            setDesc("");
            setCost("");
            setImageSrc("");
            setImageName("");
            loadMyListings();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to create listing.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (listingId: number) => {
        if (!user) return;
        try {
            await removeListingRequest(user.userId, listingId);
            loadMyListings();
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Failed to delete listing.");
        }
    };

    const handleReturnBorrowed = async (listing: Listing) => {
        if (!user || !listing.borrowId) return;

        try {
            await removeBorrowRequest(user.userId, listing.borrowId);
            loadMyListings();
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Failed to return borrowed tool.");
        }
    };

    if (!user) {
        return (
            <div className="py-8 px-4 sm:px-8 min-h-[70vh]" style={{ backgroundColor: COLORS.canvas }}>
                <div className="max-w-sm mx-auto text-center">
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}
                    >
                        My Listings
                    </h1>
                    <p className="text-sm mb-6" style={{ color: "#5C5648" }}>
                        Log in to create and manage your tool listings.
                    </p>
                    <button
                        type="button"
                        onClick={onNavigateToAccount}
                        className="text-sm font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm"
                        style={{ backgroundColor: COLORS.steel, color: COLORS.canvas }}
                    >
                        Go to Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-8 min-h-[70vh]" style={{ backgroundColor: COLORS.canvas }}>
            <div className="max-w-2xl mx-auto">
                <h1
                    className="text-2xl sm:text-3xl font-bold mb-6"
                    style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}
                >
                    My Listings
                </h1>

                {/* create form */}
                <form
                    onSubmit={handleCreate}
                    className="rounded-sm border p-6 flex flex-col gap-4 mb-8"
                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                >
                    <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: COLORS.ink }}>
                        List a new tool
                    </h2>

                    <div>
                        <label
                            htmlFor="title"
                            className="block text-xs font-semibold uppercase tracking-wide mb-1"
                            style={{ color: COLORS.ink }}
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                            placeholder="18V Cordless Drill"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="desc"
                            className="block text-xs font-semibold uppercase tracking-wide mb-1"
                            style={{ color: COLORS.ink }}
                        >
                            Description
                        </label>
                        <textarea
                            id="desc"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-sm border text-sm outline-none resize-none"
                            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                            placeholder="Barely used, comes with two batteries and a case."
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="cost"
                            className="block text-xs font-semibold uppercase tracking-wide mb-1"
                            style={{ color: COLORS.ink }}
                        >
                            Price per day ($)
                        </label>
                        <input
                            id="cost"
                            type="number"
                            min="1"
                            step="1"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                            placeholder="12"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="image"
                            className="block text-xs font-semibold uppercase tracking-wide mb-1"
                            style={{ color: COLORS.ink }}
                        >
                            Listing photo
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm"
                            style={{ color: COLORS.ink }}
                        />
                        {imageName && (
                            <p className="mt-1 text-xs" style={{ color: "#5C5648" }}>
                                Selected: {imageName}
                            </p>
                        )}
                        {imageSrc && (
                            <div className="mt-3 flex items-center gap-3 rounded-sm border p-3" style={{ borderColor: COLORS.line, backgroundColor: COLORS.canvas }}>
                                <img
                                    src={imageSrc}
                                    alt="Listing preview"
                                    className="w-16 h-16 rounded-sm object-cover border"
                                    style={{ borderColor: COLORS.line }}
                                />
                                <p className="text-xs" style={{ color: "#5C5648" }}>
                                    Preview of the image that will appear on your listing.
                                </p>
                            </div>
                        )}
                    </div>

                    {formError && (
                        <p className="text-xs font-semibold" style={{ color: COLORS.rust }}>
                            {formError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-sm font-semibold uppercase tracking-wide py-2.5 rounded-sm transition-colors disabled:opacity-60"
                        style={{ backgroundColor: COLORS.rust, color: COLORS.canvas }}
                    >
                        {isSubmitting ? "Listing..." : "Create listing"}
                    </button>
                </form>

                {/* my listings */}
                {isLoading ? (
                    <p className="text-sm" style={{ color: "#8C8574" }}>
                        Loading your listings...
                    </p>
                ) : loadError ? (
                    <p className="text-sm font-semibold" style={{ color: COLORS.rust }}>
                        {loadError}
                    </p>
                ) : myListings.length === 0 ? (
                    <p className="text-sm" style={{ color: "#8C8574" }}>
                        You haven't listed any tools yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {myListings.map((listing) => (
                            <div
                                key={listing.listingId}
                                className="flex items-center justify-between rounded-sm border p-4"
                                style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getListingImageSrc(listing)}
                                        alt={listing.title}
                                        className="w-14 h-14 rounded-sm object-cover border"
                                        style={{ borderColor: COLORS.line }}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                                            {listing.title}
                                        </p>
                                        <p className="text-xs" style={{ color: "#5C5648" }}>
                                            ${listing.cost}/day
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(listing.listingId)}
                                    className="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-sm"
                                    style={{ backgroundColor: COLORS.canvas, color: COLORS.rust, border: `1px solid ${COLORS.line}` }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-10">
                    <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}>
                        Tools I’m borrowing
                    </h2>

                    {isLoading ? (
                        <p className="text-sm" style={{ color: "#8C8574" }}>
                            Loading borrowed tools...
                        </p>
                    ) : borrowedListings.length === 0 ? (
                        <p className="text-sm" style={{ color: "#8C8574" }}>
                            You aren't borrowing any tools right now.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {borrowedListings.map((listing) => (
                                <div
                                    key={listing.listingId}
                                    className="flex items-center justify-between rounded-sm border p-4"
                                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={getListingImageSrc(listing)}
                                            alt={listing.title}
                                            className="w-14 h-14 rounded-sm object-cover border"
                                            style={{ borderColor: COLORS.line }}
                                        />
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                                                {listing.title}
                                            </p>
                                            <p className="text-xs" style={{ color: "#5C5648" }}>
                                                From {listing.userName} · ${listing.cost}/day
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleReturnBorrowed(listing)}
                                        className="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-sm"
                                        style={{ backgroundColor: COLORS.canvas, color: COLORS.rust, border: `1px solid ${COLORS.line}` }}
                                    >
                                        Return
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyListings;
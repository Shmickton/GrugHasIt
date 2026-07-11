import { useState, useEffect, type FormEvent } from "react";
import type { User } from "./Account";
import { searchListings, createListing, removeListing as removeListingRequest, type Listing } from "../api";

const COLORS = {
    ink: "#22282B",
    steel: "#3E5C68",
    canvas: "#F3EFE6",
    card: "#FBF8F1",
    rust: "#B5502C",
    line: "#D8D0BC",
};

type MyListingsProps = {
    user: User | null;
    onNavigateToAccount: () => void;
};

function MyListings({ user, onNavigateToAccount }: MyListingsProps) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [cost, setCost] = useState("");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadMyListings = () => {
        if (!user) return;
        setIsLoading(true);
        setLoadError("");
        searchListings("")
            .then((all) => setListings(all.filter((l) => l.userId === user.userId)))
            .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load your listings."))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadMyListings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            await createListing(user.userId, { title: title.trim(), desc: desc.trim(), cost: parsedCost });
            setTitle("");
            setDesc("");
            setCost("");
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
            setListings((prev) => prev.filter((l) => l.listingId !== listingId));
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Failed to delete listing.");
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
                ) : listings.length === 0 ? (
                    <p className="text-sm" style={{ color: "#8C8574" }}>
                        You haven't listed any tools yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {listings.map((listing) => (
                            <div
                                key={listing.listingId}
                                className="flex items-center justify-between rounded-sm border p-4"
                                style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                            >
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                                        {listing.title}
                                    </p>
                                    <p className="text-xs" style={{ color: "#5C5648" }}>
                                        ${listing.cost}/day
                                    </p>
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
            </div>
        </div>
    );
}

export default MyListings;
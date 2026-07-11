import { Search, Clock } from "lucide-react";

// ---------------------------------------------
// Palette (workshop / hardware-store tag theme)
// ---------------------------------------------
const COLORS = {
    ink: "#22282B",
    canvas: "#F3EFE6",
    card: "#FBF8F1",
    rust: "#B5502C",
    line: "#D8D0BC",
};

type ListingSearchBarProps = {
    query: string;
    onQueryChange: (value: string) => void;
    resultCount: number;
};

function ListingSearchBar({ query, onQueryChange, resultCount }: ListingSearchBarProps) {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                    <p
                        className="text-xs uppercase tracking-[0.2em] font-semibold mb-1"
                        style={{ color: COLORS.rust }}
                    >
                        Borrow, don't buy
                    </p>
                    <h1
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}
                    >
                        Tools near you
                    </h1>
                </div>

                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-sm border w-full sm:w-72"
                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                >
                    <Search size={16} color="#8C8574" />
                    <input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search listings..."
                        className="bg-transparent outline-none text-sm w-full"
                        style={{ color: COLORS.ink }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "#8C8574" }}>
                <Clock size={12} />
                {resultCount} tool{resultCount !== 1 ? "s" : ""} listed near you
            </div>
        </>
    );
}

export default ListingSearchBar;
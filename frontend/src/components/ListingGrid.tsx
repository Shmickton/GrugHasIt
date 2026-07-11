import { useState, useMemo } from "react";
import { Search, Clock } from "lucide-react";
const COLORS = {
  ink: "#22282B",       // near-black text
  steel: "#3E5C68",     // structural blue-steel
  canvas: "#F3EFE6",    // tarp/kraft-paper background
  card: "#FBF8F1",      // tag stock
  yellow: "#F5B700",    // safety-yellow accent
  rust: "#B5502C",      // rust/price-stamp accent
  olive: "#5B7553",     // "available" status
  line: "#D8D0BC",      // hairline / perforation
};

type Listing = {
  id: string;
  title: string;
  owner: string;
  pricePerDay: number;
  available: boolean;
  availableFrom?: string; // shown when not currently available
  image: string;
};

// Sample listings
const LISTINGS: Listing[] = [
  { id: "1", title: "18V Cordless Drill Kit", owner: "Marco T.", pricePerDay: 12, available: true, image: "https://picsum.photos/seed/drill-kit/400/300" },
  { id: "2", title: "Circular Saw, 7-1/4\"", owner: "Priya S.", pricePerDay: 15, available: true, image: "https://picsum.photos/seed/circular-saw/400/300" },
  { id: "3", title: "24ft Extension Ladder", owner: "Dan W.", pricePerDay: 18, available: false, availableFrom: "Thu", image: "https://picsum.photos/seed/extension-ladder/400/300" },
  { id: "4", title: "Petrol Hedge Trimmer", owner: "Elena R.", pricePerDay: 10, available: true, image: "https://picsum.photos/seed/hedge-trimmer/400/300" },
  { id: "5", title: "Wet Tile Cutter", owner: "Sam K.", pricePerDay: 20, available: true, image: "https://picsum.photos/seed/tile-cutter/400/300" },
  { id: "6", title: "Electric Pressure Washer", owner: "Aisha M.", pricePerDay: 16, available: false, availableFrom: "Sat", image: "https://picsum.photos/seed/pressure-washer/400/300" },
  { id: "7", title: "Socket Set, 40pc", owner: "Marco T.", pricePerDay: 6, available: true, image: "https://picsum.photos/seed/socket-set/400/300" },
  { id: "8", title: "Rotary Laser Level", owner: "Owen P.", pricePerDay: 14, available: true, image: "https://picsum.photos/seed/laser-level/400/300" },
  { id: "9", title: "Rototiller / Cultivator", owner: "Elena R.", pricePerDay: 22, available: true, image: "https://picsum.photos/seed/rototiller/400/300" },
];

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
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />

          <span
            className="absolute top-2 right-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-sm font-semibold"
            style={{
              backgroundColor: listing.available ? COLORS.olive : COLORS.ink,
              color: COLORS.canvas,
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: listing.available ? COLORS.yellow : "#B7ADA0" }}
            />
            {listing.available ? "Available now" : `Free ${listing.availableFrom}`}
          </span>
        </div>

        {/* perforated stub divider */}
        <div
          className="h-0"
          style={{
            borderTop: `2px dashed ${COLORS.line}`,
          }}
        />

        {/* details */}
        <div className="p-3">
          <h3
            className="text-sm font-semibold leading-snug mb-1"
            style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.01em" }}
          >
            {listing.title}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: "#5C5648" }}>
              {listing.owner}
            </span>

            <div
              className="text-base font-bold px-2 py-0.5 -rotate-1"
              style={{
                color: COLORS.rust,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              ${listing.pricePerDay}
              <span className="text-[10px] font-medium" style={{ color: "#8C8574" }}>
                /day
              </span>
            </div>
          </div>

          <button
            className="mt-3 w-full text-xs font-semibold uppercase tracking-wide py-2 rounded-sm transition-colors"
            style={{
              backgroundColor: listing.available ? COLORS.steel : COLORS.canvas,
              color: listing.available ? COLORS.canvas : COLORS.ink,
              border: listing.available ? "none" : `1px solid ${COLORS.line}`,
            }}
          >
            {listing.available ? "Rent this" : "Notify me"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingGrid() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) => l.title.toLowerCase().includes(query.toLowerCase()));
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
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-sm border w-full sm:w-72"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
          >
            <Search size={16} color="#8C8574" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search listings..."
              className="bg-transparent outline-none text-sm w-full"
              style={{ color: COLORS.ink }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "#8C8574" }}>
          <Clock size={12} />
          {filtered.length} tool{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filtered.map((listing) => (
              <ListingTile key={listing.id} listing={listing} />
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
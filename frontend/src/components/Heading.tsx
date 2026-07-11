import { User, List, Wrench } from "lucide-react";

export type View = "listings" | "myListings" | "account";

type HeadingProps = {
    activeView: View;
    onNavigate: (view: View) => void;
};

function Heading({ activeView, onNavigate }: HeadingProps) {
    const COLORS = {
        ink: "#22282B",
        header: "#f5e3b8",
        rust: "#B5502C",
        line: "#D8B98A",
    };

    const navLinks: { label: string; icon: typeof User; view: View }[] = [
        { label: "Listings", icon: List, view: "listings" },
        { label: "My Listings", icon: Wrench, view: "myListings" },
        { label: "Account", icon: User, view: "account" },
    ];

    return (
        <nav
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-4 sm:px-8 border-b"
            style={{ backgroundColor: COLORS.header, borderColor: COLORS.line }}
        >
            {/* brand */}
            <div>
                <p
                    className="text-xs uppercase tracking-[0.2em] font-semibold mb-0.5"
                    style={{ color: COLORS.ink }}
                >
                    Need a tool?
                </p>
                <h1
                    className="text-xl sm:text-2xl font-bold leading-none"
                    style={{ color: COLORS.rust, fontFamily: "'Oswald', sans-serif" }}
                >
                    GrugHasIt
                </h1>
            </div>

            {/* nav links */}
            <ul className="flex items-center gap-1 sm:gap-2">
                {navLinks.map(({ label, icon: Icon, view }) => {
                    const isActive = activeView === view;
                    return (
                        <li key={view}>
                            <button
                                type="button"
                                onClick={() => onNavigate(view)}
                                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-sm transition-colors"
                                style={{
                                    color: isActive ? COLORS.header : COLORS.ink,
                                    backgroundColor: isActive ? COLORS.rust : "transparent",
                                }}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Heading;
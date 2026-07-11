function MyListings() {
    const COLORS = {
        ink: "#22282B",
        canvas: "#F3EFE6",
        card: "#FBF8F1",
        rust: "#B5502C",
        line: "#D8D0BC",
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-8" style={{ backgroundColor: COLORS.canvas }}>
            <div className="max-w-2xl mx-auto">
                <h1
                    className="text-2xl sm:text-3xl font-bold mb-6"
                    style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}
                >
                    My Listings
                </h1>

                <div
                    className="rounded-sm border p-6"
                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                >
                    <p className="text-sm" style={{ color: COLORS.ink }}>
                        Tools you've listed for rent will show up here.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MyListings;
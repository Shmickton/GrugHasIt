function Heading() {
    const COLORS = {
        ink: "#22282B",
        header: "#f5e3b8",
        rust: "#B5502C",
    };
    return (
        <div className="py-8 px-4 sm:px-8" style={{ backgroundColor: COLORS.header }}>
            <p
                className="text-xs uppercase tracking-[0.2em] font-semibold mb-1"
                style={{ color: COLORS.ink }}
            >
                Need a tool?
            </p>
            <h1
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: COLORS.rust, fontFamily: "'Oswald', sans-serif" }}
            >
                GrugHasIt
            </h1>
        </div>
    );
}

export default Heading;
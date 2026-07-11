import { useState, type FormEvent } from "react";

const COLORS = {
    ink: "#22282B",
    steel: "#3E5C68",
    canvas: "#F3EFE6",
    card: "#FBF8F1",
    rust: "#B5502C",
    line: "#D8D0BC",
};

type Mode = "login" | "register";

function Account() {
    const [mode, setMode] = useState<Mode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (mode === "register" && password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        // TODO: wire this up to a real auth endpoint
        console.log(mode === "login" ? "Logging in" : "Registering", { name, email, password });
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        setError("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-8 min-h-[70vh]" style={{ backgroundColor: COLORS.canvas }}>
            <div className="max-w-sm mx-auto">
                {/* mode toggle */}
                <div
                    className="flex rounded-sm border overflow-hidden mb-6"
                    style={{ borderColor: COLORS.line }}
                >
                    <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="flex-1 text-sm font-semibold uppercase tracking-wide py-2 transition-colors"
                        style={{
                            backgroundColor: mode === "login" ? COLORS.steel : COLORS.card,
                            color: mode === "login" ? COLORS.canvas : COLORS.ink,
                        }}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className="flex-1 text-sm font-semibold uppercase tracking-wide py-2 transition-colors"
                        style={{
                            backgroundColor: mode === "register" ? COLORS.steel : COLORS.card,
                            color: mode === "register" ? COLORS.canvas : COLORS.ink,
                        }}
                    >
                        Register
                    </button>
                </div>

                <h1
                    className="text-2xl font-bold mb-1"
                    style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}
                >
                    {mode === "login" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm mb-6" style={{ color: "#5C5648" }}>
                    {mode === "login"
                        ? "Log in to rent tools or manage your listings."
                        : "Sign up to start borrowing and lending tools."}
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-sm border p-6 flex flex-col gap-4"
                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                >
                    {mode === "register" && (
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-xs font-semibold uppercase tracking-wide mb-1"
                                style={{ color: COLORS.ink }}
                            >
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                                placeholder="Jane Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold uppercase tracking-wide mb-1"
                            style={{ color: COLORS.ink }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-semibold uppercase tracking-wide mb-1"
                            style={{ color: COLORS.ink }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                            placeholder="••••••••"
                        />
                    </div>

                    {mode === "register" && (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-xs font-semibold uppercase tracking-wide mb-1"
                                style={{ color: COLORS.ink }}
                            >
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-sm border text-sm outline-none"
                                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.canvas }}
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-xs font-semibold" style={{ color: COLORS.rust }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="mt-2 w-full text-sm font-semibold uppercase tracking-wide py-2.5 rounded-sm transition-colors"
                        style={{ backgroundColor: COLORS.rust, color: COLORS.canvas }}
                    >
                        {mode === "login" ? "Log in" : "Create account"}
                    </button>
                </form>

                <p className="text-xs text-center mt-4" style={{ color: "#8C8574" }}>
                    {mode === "login" ? "New here? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => switchMode(mode === "login" ? "register" : "login")}
                        className="font-semibold underline"
                        style={{ color: COLORS.steel }}
                    >
                        {mode === "login" ? "Create an account" : "Log in"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Account;
import { useState, type FormEvent, type Dispatch, type SetStateAction } from "react";

const COLORS = {
    ink: "#22282B",
    steel: "#3E5C68",
    canvas: "#F3EFE6",
    card: "#FBF8F1",
    rust: "#B5502C",
    olive: "#5B7553",
    line: "#D8D0BC",
};

// Adjust to wherever your Express server actually runs.
// If you set up a Vite proxy for /auth, you can leave this as "".
const API_BASE_URL = "http://127.0.0.1:3000";

type Mode = "login" | "register";

export type User = {
    userId: number;
    userName: string;
    email: string;
};

// TODO: confirm UserLogin returns the same { userId, userName, email } shape as UserRegister.
type AuthResponse = User;

// Matches the { error: 'CODE', message: '...' } shape your Express routes return on failure.
type AuthErrorResponse = {
    error?: string;
    message?: string;
};

async function callAuthEndpoint<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sends/receives the session cookie
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        const errData = data as AuthErrorResponse;
        throw new Error(errData.message ?? errData.error ?? `Request failed with status ${res.status}`);
    }

    return data as T;
}

type AccountProps = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
};

function Account({ user, setUser }: AccountProps) {
    const [mode, setMode] = useState<Mode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (mode === "register" && password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload =
                mode === "register" ? { UserName: name, email, password } : { email, password };

            const registeredOrLoggedInUser = await callAuthEndpoint<AuthResponse>(`/auth/${mode}`, payload);

            setUser(registeredOrLoggedInUser);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchMode = (next: Mode) => {
        setMode(next);
        setError("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleLogout = async () => {
        setIsSubmitting(true);
        try {
            await callAuthEndpoint<unknown>("/auth/logout");
        } catch (err) {
            // Even if the request fails, clear local state so the UI doesn't get stuck.
            console.error("Logout request failed:", err);
        } finally {
            setUser(null);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setMode("login");
            setIsSubmitting(false);
        }
    };

    if (user) {
        return (
            <div className="py-8 px-4 sm:px-8 min-h-[70vh]" style={{ backgroundColor: COLORS.canvas }}>
                <div className="max-w-sm mx-auto">
                    <h1
                        className="text-2xl font-bold mb-6"
                        style={{ color: COLORS.ink, fontFamily: "'Oswald', sans-serif" }}
                    >
                        My Account
                    </h1>

                    <div
                        className="rounded-sm border p-6"
                        style={{ backgroundColor: COLORS.card, borderColor: COLORS.line }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                                style={{ backgroundColor: COLORS.steel, color: COLORS.canvas }}
                            >
                                {user.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                                    {user.userName}
                                </p>
                                <span
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-sm mt-0.5"
                                    style={{ backgroundColor: COLORS.olive, color: COLORS.canvas }}
                                >
                                    Logged in
                                </span>
                            </div>
                        </div>

                        <dl className="flex flex-col gap-3 mb-6">
                            <div>
                                <dt
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: "#8C8574" }}
                                >
                                    Name
                                </dt>
                                <dd className="text-sm" style={{ color: COLORS.ink }}>
                                    {user.userName}
                                </dd>
                            </div>
                            <div>
                                <dt
                                    className="text-xs font-semibold uppercase tracking-wide"
                                    style={{ color: "#8C8574" }}
                                >
                                    Email
                                </dt>
                                <dd className="text-sm" style={{ color: COLORS.ink }}>
                                    {user.email}
                                </dd>
                            </div>
                        </dl>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isSubmitting}
                            className="w-full text-sm font-semibold uppercase tracking-wide py-2.5 rounded-sm transition-colors disabled:opacity-60"
                            style={{ backgroundColor: COLORS.canvas, color: COLORS.ink, border: `1px solid ${COLORS.line}` }}
                        >
                            {isSubmitting ? "Logging out..." : "Log out"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-8 min-h-[70vh]" style={{ backgroundColor: COLORS.canvas }}>
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
                        disabled={isSubmitting}
                        className="mt-2 w-full text-sm font-semibold uppercase tracking-wide py-2.5 rounded-sm transition-colors disabled:opacity-60"
                        style={{ backgroundColor: COLORS.rust, color: COLORS.canvas }}
                    >
                        {isSubmitting
                            ? mode === "login"
                                ? "Logging in..."
                                : "Creating account..."
                            : mode === "login"
                            ? "Log in"
                            : "Create account"}
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
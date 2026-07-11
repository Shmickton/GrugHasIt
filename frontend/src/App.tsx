import { useState, useEffect } from "react";
import "./App.css";
import Heading, { type View } from "./components/Heading";
import ListingGrid from "./components/ListingGrid";
import MyListings from "./components/MyListings";
import Account, { type User } from "./components/Account";

const USER_STORAGE_KEY = "grughasit_user";

function loadStoredUser(): User | null {
    try {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        // Corrupted or missing data — just start logged out rather than crashing.
        return null;
    }
}

function App() {
    const [activeView, setActiveView] = useState<View>("listings");
    const [user, setUser] = useState<User | null>(loadStoredUser);

    // Whenever `user` changes (login, register, or logout), keep localStorage in sync.
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [user]);

    return (
        <>
            <Heading activeView={activeView} onNavigate={setActiveView} />

            {activeView === "listings" && (
                <ListingGrid user={user} onNavigateToAccount={() => setActiveView("account")} />
            )}
            {activeView === "myListings" && (
                <MyListings user={user} onNavigateToAccount={() => setActiveView("account")} />
            )}
            {activeView === "account" && <Account user={user} setUser={setUser} />}
        </>
    );
}

export default App;
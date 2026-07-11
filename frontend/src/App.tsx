import { useState } from "react";
import "./App.css";
import Heading, { type View } from "./components/Heading";
import ListingGrid from "./components/ListingGrid";
import MyListings from "./components/MyListings.tsx";
import Account from "./components/Account.tsx";
 
function App() {
    const [activeView, setActiveView] = useState<View>("listings");
 
    return (
        <>
            <Heading activeView={activeView} onNavigate={setActiveView} />
 
            {activeView === "listings" && <ListingGrid />}
            {activeView === "myListings" && <MyListings />}
            {activeView === "account" && <Account />}
        </>
    );
}
 
export default App;

// R/W TO DATABASE

import { getData, saveData } from "../dataStore";

export function saveUser(user) {
    const data = getData();
    data.users.push(user);
    saveData();
}

export function getUser() {

}

export function getUsers() {

}

export function authenticateListing(userId, listingId) {
    const data = getData();
    const listing = data.listings.find(listing => listing.listingId === listingId);
    if (!listing) {
        //error
    }

    if (listing.userId != userId) {
        //errors
    }
}

export function saveListing(user, title, desc, cost) {
    const data = getData();
    const id = data.next_lid;
    data.listings.push({ 
        listingId: id, 
        userId: user, 
        title: title, 
        desc: desc, 
        cost: cost 
    });
    data.next_lid++;
    saveData();
    return id;
}

export function removeListing(id) {
    const data = getData();
    data.listings = data.listings.filter(listing => listing.listingId !== id);
    saveData();
}

export function updateListing(id, title, desc, cost) {
    const data = getData();
    const listing = data.listings.find(listing => listing.listingId === id);
    listing.title = title;
    listing.desc = desc;
    listing.cost = cost;
    saveData();
}

export function getListing() {

}

export function getListings() {

}

export function saveBorrow() {

}

export function removeBorrow() {

}

export function getBorrows() {

}
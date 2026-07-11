
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

export function saveListing() {

}

export function removeListing() {

}

export function updateListing() {

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
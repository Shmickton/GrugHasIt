// R/W TO DATABASE

import { getData, saveData } from "../dataStore.js";
import { GrugError } from "./GrugError.js";

export const UserRegister = (email, password, UserName) => {
  const data = getData();

  if (typeof email !== "string" || typeof password !== "string" || typeof UserName !== "string") {
    throw new GrugError("INVALID_INPUT", "All registration fields must be strings");
  }

  const trimmedEmail = email.trim();
  const trimmedUserName = UserName.trim();

  // Email validating
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new GrugError('INVALID_EMAIL', 'Email format is invalid');
  }

  // Repetitive email validating
  if (data.users.find(user => user.email === trimmedEmail)) {
    throw new GrugError('INVALID_EMAIL', 'Email is already in use');
  }

  // User name validating
  if (!/^[A-Za-z\s'-]+$/.test(trimmedUserName) || trimmedUserName.length < 2 || trimmedUserName.length > 20) {
    throw new GrugError('INVALID_USER_NAME', 'User name must be 2-20 characters and only letters/spaces');
  }

  // Password validating
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new GrugError('INVALID_PASSWORD', 'Password must be at least 8 characters, with letters and numbers');
  }

  // Creates new user object
  const newUser = {
    userId: data.next_uid++,
    userName: trimmedUserName,
    email: trimmedEmail,
    password,
  };

  // Push the new User to the stored data
  data.users.push(newUser);
  saveData();

  return { userId: newUser.userId, userName: newUser.userName, email: newUser.email };
};

export const UserLogin = (email, password) => {
  const data = getData();

  if (typeof email !== "string" || typeof password !== "string") {
    throw new GrugError("INVALID_INPUT", "Email and password must be strings");
  }

  const trimmedEmail = email.trim();
  const user = data.users.find(currentUser => currentUser.email === trimmedEmail);

  if (!user || user.password !== password) {
    throw new GrugError("INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  // Only one user can be logged in at a time.
  data.currentUser = user.userId;
  saveData();

  return { userId: user.userId };
};

export const UserLogout = () => {
  const data = getData();

  if (data.currentUser === null) {
    throw new GrugError("INVALID_USER", "No user is currently logged in");
  }

  data.currentUser = null;
  saveData();


  return {};
};


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
    const data = getData();
    return data.listings;
}

export function saveBorrow() {

}

export function removeBorrow() {

}

export function getBorrows() {

}
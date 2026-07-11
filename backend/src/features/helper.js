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
  data.currentUser = newUser.userId;
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

  return { userId: user.userId, userName: user.userName, email: user.email };
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
        throw new GrugError('INVALID_LISTING', 'Listing does not exist');
    }

    if (listing.userId !== userId) {
        throw new GrugError('INVALID_USER', 'You do not have permission to modify this listing');
    }

    return listing;
}

function getActiveBorrowForListing(data, listingId) {
  return data.borrows.find(borrow => borrow.listingId === listingId && borrow.status === 'active') ?? null;
}

function decorateListingWithBorrow(data, listing) {
  const activeBorrow = getActiveBorrowForListing(data, listing.listingId);

  return {
    ...listing,
    borrowId: activeBorrow?.borrowId ?? null,
    borrowedBy: activeBorrow?.borrowerId ?? null,
    borrowedByName: activeBorrow?.borrowerName ?? null,
    borrowStatus: activeBorrow ? 'borrowed' : 'available',
  };
}

export function saveListing(user, title, desc, cost, imageSrc = null) {
    const data = getData();
    const id = data.next_lid;
    const name = data.users.find((u) => u.userId === user).userName;

  if (typeof imageSrc === 'string' && imageSrc.length > 0 && !imageSrc.startsWith('data:image/')) {
    throw new GrugError('INVALID_IMAGE', 'Listing image must be a valid uploaded image');
  }

    data.listings.push({ 
        listingId: id, 
        userName: name,
        userId: user, 
        title: title, 
        desc: desc, 
        cost: cost 
    ,imageSrc: typeof imageSrc === 'string' && imageSrc.length > 0 ? imageSrc : null
    });
    data.next_lid++;
    saveData();
    return id;
}

export function removeListing(id) {
    const data = getData();
    const removed = data.listings.find(listing => listing.listingId === id);
    data.listings = data.listings.filter(listing => listing.listingId !== id);
  data.borrows = data.borrows.filter(borrow => borrow.listingId !== id);
    saveData();
    return removed ?? null;
}

export function updateListing(id, title, desc, cost) {
    const data = getData();
    const listing = data.listings.find(listing => listing.listingId === id);
    if (!listing) {
        throw new GrugError('INVALID_LISTING', 'Listing does not exist');
    }
    listing.title = title;
    listing.desc = desc;
    listing.cost = cost;
    saveData();
    return listing;
}

export function getListing(id) {
    const data = getData();
  const listing = data.listings.find(listing => listing.listingId === id) ?? null;
  return listing ? decorateListingWithBorrow(data, listing) : null;
}

export function getListings() {
    const data = getData();
  return data.listings.map(listing => decorateListingWithBorrow(data, listing));
}

export function saveBorrow(userId, listingId) {
  const data = getData();

  if (!Number.isInteger(userId) || !Number.isInteger(listingId)) {
    throw new GrugError('INVALID_INPUT', 'User ID and listing ID must be numbers');
  }

  const user = data.users.find(currentUser => currentUser.userId === userId);
  if (!user) {
    throw new GrugError('INVALID_USER', 'User does not exist');
  }

  if (data.currentUser !== userId) {
    throw new GrugError('INVALID_USER', 'You must be logged in to borrow a listing');
  }

  const listing = data.listings.find(currentListing => currentListing.listingId === listingId);
  if (!listing) {
    throw new GrugError('INVALID_LISTING', 'Listing does not exist');
  }

  if (listing.userId === userId) {
    throw new GrugError('INVALID_USER', 'You cannot borrow your own listing');
  }

  const activeBorrow = getActiveBorrowForListing(data, listingId);
  if (activeBorrow) {
    throw new GrugError('LISTING_UNAVAILABLE', 'This listing is already borrowed');
  }

  const borrow = {
    borrowId: data.next_bid++,
    listingId,
    borrowerId: userId,
    borrowerName: user.userName,
    ownerId: listing.userId,
    ownerName: listing.userName,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.borrows.push(borrow);
  saveData();

  return borrow;
}

export function updateBorrow(userId, borrowId, updates = {}) {
  const data = getData();

  if (!Number.isInteger(userId) || !Number.isInteger(borrowId)) {
    throw new GrugError('INVALID_INPUT', 'User ID and borrow ID must be numbers');
  }

  const borrow = data.borrows.find(currentBorrow => currentBorrow.borrowId === borrowId);
  if (!borrow) {
    throw new GrugError('INVALID_BORROW', 'Borrow record does not exist');
  }

  if (data.currentUser !== userId || (borrow.borrowerId !== userId && borrow.ownerId !== userId)) {
    throw new GrugError('INVALID_USER', 'You do not have permission to update this borrow');
  }

  if (updates.status === 'active' || updates.status === 'returned') {
    borrow.status = updates.status;
  }

  if (typeof updates.note === 'string') {
    borrow.note = updates.note.trim();
  }

  borrow.updatedAt = new Date().toISOString();
  saveData();

  return borrow;
}

export function removeBorrow(userId, borrowId) {
  const data = getData();

  if (!Number.isInteger(userId) || !Number.isInteger(borrowId)) {
    throw new GrugError('INVALID_INPUT', 'User ID and borrow ID must be numbers');
  }

  const borrow = data.borrows.find(currentBorrow => currentBorrow.borrowId === borrowId);
  if (!borrow) {
    throw new GrugError('INVALID_BORROW', 'Borrow record does not exist');
  }

  if (data.currentUser !== userId || (borrow.borrowerId !== userId && borrow.ownerId !== userId)) {
    throw new GrugError('INVALID_USER', 'You do not have permission to remove this borrow');
  }

  data.borrows = data.borrows.filter(currentBorrow => currentBorrow.borrowId !== borrowId);
  saveData();

  return borrow;
}

export function getBorrows(userId = null) {
  const data = getData();

  if (typeof userId === 'number') {
    return data.borrows.filter(borrow => borrow.borrowerId === userId || borrow.ownerId === userId);
  }

  return data.borrows;
}
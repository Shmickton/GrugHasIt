// R/W TO DATABASE

import crypto from "crypto";
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
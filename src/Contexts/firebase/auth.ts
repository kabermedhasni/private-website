import { auth } from "./FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

export const doSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const doPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const doPasswordUpdate = async (password: string) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }
  try {
    await updatePassword(auth.currentUser, password);
  } catch (error) {
    throw error;
  }
};

export const doSendEmailVerification = async () => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }
  try {
    await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  } catch (error) {
    throw error;
  }
};

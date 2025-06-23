import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase.init";
import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = () => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);
  const authInfo = {
    createUser,
    signIn,
    signWithGoogle,
    loading,
    setLoading,
    user,
    setUser,
    logOut,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
}

export default AuthProvider;

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getIdTokenResult(user)
          .then((token) => {
            if (token.claims.admin) {
              setIsAdmin(token.claims.admin);
            }
            setUser(user);
            setUserAvatar(user?.photoURL);
            setLoading(false);
          })
          .catch((err) => {
            return err.message;
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, [user]);
  return { user, userAvatar, isAdmin, isLoading };
};

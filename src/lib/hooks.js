import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

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
            return (err.message);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, [user]);
  return { user, userAvatar, isAdmin, loading };
};

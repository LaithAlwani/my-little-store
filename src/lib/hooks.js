import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot} from "firebase/firestore";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userStoreId, setUserStoreId] = useState(null);

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
            onSnapshot(doc(db, "users", user.uid),(docRef) => {
              setUserStoreId(docRef.data().storeId);
            });
          })
          .catch((err) => {
            return err.message;
          });
      } else {
        setUser(null);
        setUserStoreId(null);
        setLoading(false);
      }
    });
  }, [user, userStoreId]);
  return { user, userAvatar, isAdmin, isLoading, userStoreId };
};

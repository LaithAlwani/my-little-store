import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;
    setLoading(true);
    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        onSnapshot(doc(db, "users", auth.currentUser.uid),docRef => {
          setStoreId(docRef.data().storeId);
        });
        setLoading(false);
      } else {
        setUser(null);
        setStoreId(null);
        setLoading(false);
      }
      return unsubscribe;
    });
  }, [user]);
  return { user, storeId, loading };
};

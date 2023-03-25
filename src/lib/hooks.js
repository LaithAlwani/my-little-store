import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;
    setLoading(true);
    unsubscribe =  onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false)
      } else {
        setUser(null);
        setLoading(false)
      }
      return unsubscribe;
    });
  }, [user]);
  return { user, loading };
};

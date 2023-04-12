import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import Store from "../components/Store";

export default function HomePage() {
  const [stores, setStores] = useState([]);

  const fetchStores = (col, callback) => {
    const q = query(collection(db, col), orderBy("updatedAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      callback([]);
      querySnapshot.forEach((doc) => {
        callback((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
      });
    });
  };

  useEffect(() => {
    let unSubscribe;
    if (stores.length !== 0) {
      return
    }
    unSubscribe = fetchStores("stores", setStores);
    return unSubscribe;
  }, []);
  return (
    <>
      <div className="container">
        <p className="muted">*** click a game to checkout its BGG page***</p>
      </div>

      <div className="container">
        {stores.length > 0 && (
          <div className="gamelist">
            {stores.map((store) => (
              <Store store={store} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
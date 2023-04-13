import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import Store from "../components/Store";
import { BsHouseAddFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";

export default function HomePage() {
  const { user, storeId } = useContext(UserContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState([]);

  const fetchStores = (col, callback) => {
    setLoading(true);
    const q = query(collection(db, col), orderBy("updatedAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      callback([]);
      querySnapshot.forEach((doc) => {
        callback((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    let unSubscribe;
    if (stores.length !== 0) {
      return;
    }
    unSubscribe = fetchStores("stores", setStores);
    return unSubscribe;
  }, []);
  return !loading ? (
    <div className="container">
      {stores.length > 0 ? (
        <div className="gamelist">
          {stores.map((store) => (
            <Store key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <h1>No Stores Found</h1>
      )}
      {!storeId && user && (
        <Link to="create" className="bg-container">
          <BsHouseAddFill size={64} />
          <h3>Create Store</h3>
        </Link>
      )}
    </div>
  ) : (
    <Loader />
  );
}

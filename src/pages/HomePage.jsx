import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Loader from "../components/Loader";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);

  const getStores = () => {
    setLoading(true);
    const q = query(collection(db, "stores"), orderBy("last_updated", "desc"));
    onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        setStores([]);
        querySnapshot.forEach((doc) => {
          setStores((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        });
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    if (stores.length != 0) return;
    getStores();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <section className="container flex">
      {stores.length > 0 ? (
        stores.map((store) => (
          <Link to={`store/${store.id}`} key={store.id} className="bg-container">
            <h1>{store.name}</h1>
            <span>
              {store["updated_at"]
                ? "update " + dayjs(store["updated_at"]?.toDate()).fromNow()
                : "created " + dayjs(store["created_at"]?.toDate()).fromNow()}
            </span>
          </Link>
        ))
      ) : (
        <h1>No Stores...</h1>
      )}
    </section>
  );
};

export default HomePage;

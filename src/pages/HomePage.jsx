import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import Loader from "../components/Loader";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { MdRemoveRedEye } from "react-icons/md";
import { UserContext } from "../lib/context";

const HomePage = () => {
  const { user, userStoreId } = useContext(UserContext);
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

  const handleClick = (storeId) => {
    if (userStoreId != storeId)
      updateDoc(doc(db, "stores", storeId), { views: increment(1) }, { merge: true }).catch((err) =>
        toast.error(err.message)
      );
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
          <Link
            to={`stores/${store.id}`}
            key={store.id}
            className={`store-container ${
              !store.boardgamesSale && !store.boardgameWanted ? "disabled-link" : ""
            }`}
            onClick={() => handleClick(store.id)}>
            <img src={store.avatar} alt="" className="store-avatar" />
            <div className="store-img-container">
              {store.boardgamesSale ? (
                store.boardgamesSale
                  ?.sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((game) => <img key={game.bggId} src={game.thumbnail} />)
              ) : (
                <h2>This store is Empty</h2>
              )}
            </div>
            <h1>{store.name}'s Store</h1>
            <span>
              <MdRemoveRedEye /> {store.views}
            </span>
            <span>
              {store["updated_at"]
                ? "update " + moment(store["updated_at"]?.toDate()).fromNow()
                : "created " + moment(store["created_at"]?.toDate()).fromNow()}
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

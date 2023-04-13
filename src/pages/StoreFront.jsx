import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import Boardgame from "../components/Boardgame";
import { db } from "../lib/firebase";
import { Link, useLocation } from "react-router-dom";
import { MdLocationOn, MdPostAdd, MdFacebook } from "react-icons/md";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";

export default function StoreFront() {
  const { storeId } = useContext(UserContext);
  const [store, setStore] = useState([]);
  const [boardgames, setBoardgames] = useState([]);
  const [loading, setLoading] = useState([]);
  const location = useLocation();
  const currentStoreId = location.pathname.split("/")[1];

  const fetchStore = (id, callback) => {
    const docRef = doc(db, "stores", id);
    setLoading(true);
    onSnapshot(docRef, (docSnapshot) => {
      callback({ id: docSnapshot.id, ...docSnapshot.data() });
    });
  };

  const fetchBoardgames = () => {
    const q = query(
      collection(db, "stores", currentStoreId, "boardgames"),
      orderBy("isWanted"),
      orderBy("status"),
      orderBy("name")
    );
    onSnapshot(q, (querySnapshot) => {
      setBoardgames([]);
      querySnapshot.forEach((docRef) => {
        setBoardgames((prevState) => [...prevState, { id: docRef.id, ...docRef.data() }]);
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    let unSubscribe;
    if (boardgames.length !== 0) {
      return;
    }
    unSubscribe = fetchBoardgames();
    fetchStore(currentStoreId, setStore);
    return unSubscribe;
  }, []);
  return !loading ? (
    <>
      <div className="container">
        <h1>{store.name}</h1>
        <p className="muted">*** click a game to checkout its BGG page***</p>
        <div className="add-game-icon">
          {storeId === currentStoreId && (
            <Link to="addgames">
              <MdPostAdd size={48} />
            </Link>
          )}
          {store.location && (
            <a href={store.location} target="_blank" className="location">
              <MdLocationOn size={32} />
              <strong>Pickup</strong>
            </a>
          )}
          {store.facebook && (
            <a href={store.facebook} target="_blank" className="location">
              <MdFacebook size={40} color="#4267B2" />
            </a>
          )}
        </div>
      </div>
      <div className="container">
        {store && boardgames?.length > 0 && (
          <div className="gamelist">
            {boardgames.map((game) => (
              <Boardgame key={game.id} storeId={currentStoreId} game={game} />
            ))}
          </div>
        )}
      </div>
    </>
  ) : (
    <Loader />
  );
}

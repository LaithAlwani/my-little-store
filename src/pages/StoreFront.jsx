import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Boardgame from "../components/Boardgame";
import { db } from "../lib/firebase";
import { useLocation } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function StoreFront() {
  const [store, setStore] = useState([]);
  const [boardgames, setBoardgames] = useState([]);
  const location = useLocation();
  const storeId = location.pathname.split("/")[1];

  const fetchStore = (id, callback) => {
    const docRef = doc(db, "stores", id);
    onSnapshot(docRef, (docSnapshot) => {
      callback({ id: docSnapshot.id, ...docSnapshot.data() });
    });
  };

  const fetchBoardgames = () => {
    const q = query(
      collection(db, "stores", storeId, "boardgames"),
      orderBy("isWanted"),
      orderBy("status"),
      orderBy("name")
    );
    onSnapshot(q, (querySnapshot) => {
      setBoardgames([]);
      querySnapshot.forEach((docRef) => {
        setBoardgames((prevState) => [
          ...prevState,
          { id: docRef.id, ...docRef.data() },
        ]);
      });
    });
  };

  useEffect(() => {
    let unSubscribe;
    if (boardgames.length !== 0) {
      return;
    }
    unSubscribe = fetchBoardgames();
    fetchStore(storeId, setStore);
    return unSubscribe;
  }, []);
  return (
    <>
      <div className="container">
        <h1>{store.name}</h1>
        <p className="muted">*** click a game to checkout its BGG page***</p>
        <a href={store.location} target="_blank" className="location">
          <MdLocationOn size={32} />
          <strong>Pickup</strong>
        </a>
      </div>

      <div className="container">
        {store && boardgames?.length > 0 && (
          <div className="gamelist">
            {boardgames.map((game) => (
              <Boardgame key={game.id} storeId={storeId} game={game} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

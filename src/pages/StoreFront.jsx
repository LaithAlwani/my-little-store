import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { MdOutlineSearch } from "react-icons/md";
import Loader from "../components/Loader";
import Boardgame from "../components/Boardgame";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../lib/context";
import { MdPostAdd } from "react-icons/md";
import toast from "react-hot-toast";

export default function StoreFront() {
  const { storeId } = useParams();
  const { userStoreId } = useContext(UserContext);
  const [store, setStore] = useState();
  const [tempgames, setTempgames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getStore = () => {
    setLoading(true);
    const q = doc(db, "stores", storeId);
    onSnapshot(q, (docSnapShot) => {
      if (docSnapShot.exists()) {
        setStore({ id: docSnapShot.id, ...docSnapShot.data() });
      }
      setLoading(false);
    });
  };

  const isStoreOwner = () => {
    return userStoreId === storeId;
  };

  useEffect(() => {
    let unSubscribe;
    if (store) {
      return;
    }
    unSubscribe = getStore();
    return unSubscribe;
  }, []);

  useEffect(() => {
    getDocs(query(collection(db, "boardgames"))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setTempgames((prev) => [...prev, doc.data()]);
      });
    });
  });

  // const copy = () => {
  //   tempgames.forEach((game) => {
  //     if (game.isWanted) {
  //       updateDoc(doc(db, "stores",storeId), { boardgamesWanted: arrayUnion(game) }).then(()=>toast.success(game.name + " has been copied"));
  //     } else {
  //       updateDoc(doc(db, "stores", storeId), { boardgamesSale: arrayUnion(game) }).then(()=>toast.success(game.name + " has been copied"));
  //     }

  //   });
  // };
  if (!store?.boardgamesSale && !store?.boardgamesWanted) {
    return (
      <div className="container">
        <h1>This Store has no games yet</h1>
        {isStoreOwner() && (
          <Link to="add" className="navLink">
            <MdPostAdd size={32} />
          </Link>
        )}
      </div>
    );
  }

  return !loading ? (
    store ? (
      <div className="container">
        {/* <button onClick={copy}>copy games</button> */}
        <div className="search-bar-container">
          {isStoreOwner() && (
            <Link to="add" className="navLink">
              <MdPostAdd size={32} />
            </Link>
          )}
          <MdOutlineSearch size={32} onClick={() => setIsSearching(!isSearching)} />
          <input
            type="text"
            className={isSearching ? "search-bar searching" : "search-bar"}
            placeholder="search boardgames"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <div className="container">
          {store.boardgamesSale?.length > 0 ? (
            <div className="gamelist">
              {store.boardgamesSale
                .filter((game) => {
                  if (search === "") {
                    return game;
                  }
                  return game.name.includes(search);
                })
                .sort((a, b) => (a.name < b.name ? 1 : -1))
                .sort((a, b) => (a.status > b.status ? 1 : -1))
                .map((game) => (
                  <Boardgame key={game.bggId} game={game} />
                ))}
            </div>
          ) : (
            <h1>No baordgames for Sale</h1>
          )}
        </div>
        <div className="container">
          {store.boardgamesWanted?.length > 0 ? (
            <div className="gamelist">
              {store.boardgamesWanted
                .filter((game) => {
                  if (search === "") {
                    return game;
                  }
                  return game.name.includes(search);
                })
                .sort((a, b) => (a.name < b.name ? 1 : -1))
                .map((game) => (
                  <Boardgame key={game.bggId} game={game} />
                ))}
            </div>
          ) : (
            <h1>Not Looking for Trades</h1>
          )}
        </div>
        {/* <div className="container">
        {wantedBoardgames?.length > 0 ? (
          <div className="gamelist">
            {wantedBoardgames
              .filter((game) => (search === "" ? game : game.name.includes(search)))
              .map((game) => (
                <Boardgame key={game.bggId} game={game} />
              ))}
          </div>
        ) : (
          <h1>Not looking to Trade</h1>
        )}
      </div> */}
      </div>
    ) : (
      <h1>Store Does Not Exist</h1>
    )
  ) : (
    <Loader />
  );
}

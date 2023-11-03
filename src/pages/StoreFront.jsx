import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
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
  const { user } = useContext(UserContext);
  const [tempgames, setTempgames] = useState([]);
  const [boardgames, setBoardgames] = useState([]);
  const [wantedBoardgames, setWantedBoardgames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getBoardgames = () => {
    setLoading(true);
    const q = query(
      collection(db, "stores", storeId, "boardgames"),
      orderBy("isWanted"),
      orderBy("status"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      setTempgames([]);
      setBoardgames([]);
      setWantedBoardgames([]);
      querySnapshot.forEach((doc) => {
        setTempgames((prevState) => [...prevState, { ...doc.data() }]);
        if (!doc.data().isWanted) {
          setBoardgames((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        } else {
          setWantedBoardgames((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        }
      })
      setLoading(false);
    });
  };

  const isStoreOwner = () => {
    return user?.uid === storeId;
  };

  useEffect(() => {
    let unSubscribe;
    if (boardgames.length !== 0) {
      return;
    }
    unSubscribe = getBoardgames();
    return unSubscribe;
  }, []);

  const copy = () => {
    tempgames.forEach((game) => {
      updateDoc(doc(db, "stores", user.uid), { boardgames: arrayUnion(game) }).then(
        toast.success(game.name + " has been copied")
      );
    });
  };

  return !loading ? (
    <div className="container">
      <button onClick={copy}>copy games</button>
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
        {boardgames?.length > 0 ? (
          <div className="gamelist">
            {boardgames
              .filter((game) => (search === "" ? game : game.name.includes(search)))
              .map((game) => (
                <Boardgame key={game.id} game={game} />
              ))}
          </div>
        ) : (
          <h1>No baordgames for Sale</h1>
        )}
      </div>
      <div className="container">
        {wantedBoardgames?.length > 0 ? (
          <div className="gamelist">
            {wantedBoardgames
              .filter((game) => (search === "" ? game : game.name.includes(search)))
              .map((game) => (
                <Boardgame key={game.id} game={game} />
              ))}
          </div>
        ) : (
          <h1>Not looking to Trade</h1>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  );
}

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import {  useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { MdOutlineSearch } from "react-icons/md";
import Loader from "../components/Loader";
import Boardgame from "../components/Boardgame";
import {DebounceInput} from 'react-debounce-input';

export default function HomePage() {
  const [boardgames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getBoardgames = (col, callback) => {
    setLoading(true);
    const q = query(collection(db, col), orderBy('status'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      callback([]);
      querySnapshot.forEach((doc) => {
        callback((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
      });
      setLoading(false);
    });
  };

  const getBoardgameByName = async (value) => {
    if (value.length < 3) {
      return getBoardgames("boardgames", setBoardGames);
    }
    setLoading(true);
    const stores = query(collection(db, "boardgames"), where("name", ">=", value));
    const querySnapshot = await getDocs(stores);
    if (!querySnapshot.empty) {
      setBoardGames([]);
      return querySnapshot.forEach((docSnapshot) => {
        setBoardGames((prevState) => [...prevState, { id: docSnapshot.id, ...docSnapshot.data() }]);
        setLoading(false);
        
      });
    } else {
      setLoading(false);
    }
    return setBoardGames([]);
  };

  useEffect(() => {
    getBoardgameByName(search)
  },[search])

  useEffect(() => {
    let unSubscribe;
    if (boardgames.length !== 0) {
      return;
    }
    unSubscribe = getBoardgames("boardgames", setBoardGames);
    return unSubscribe;
  }, []);
  return !loading ? (
    <div className="container">
      <div className="search-bar-container">
        <MdOutlineSearch size={32} onClick={() => setIsSearching(!isSearching)} />
        <DebounceInput
          minLength={3}
          debounceTimeout={500}
          type="text"
          className={isSearching ? "search-bar searching" : "search-bar"}
          placeholder="search boardgames"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <div className="container">
        <h2>FOR SALE</h2>
        { boardgames?.length > 0 ? (
          <div className="gamelist">
            {boardgames.filter(game=> !game.isWanted).map((game) => (
              <Boardgame key={game.id} game={game} />
            ))}
          </div>
        ) :
        <h1>No baordgames found</h1>
        }
      </div>
      
      <div className="container">
        <h2>WANTED</h2>
        { boardgames?.length > 0 ? (
          <div className="gamelist">
            {boardgames.filter(game=> game.isWanted).map((game) => (
              <Boardgame key={game.id} game={game} />
            ))}
          </div>
        ) :
        <h1>No baordgames found</h1>
        }
      </div>
    </div>
  ) : (
    <div className="loader-container">
      <Loader />
    </div>
  );
}

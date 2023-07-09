import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { MdOutlineSearch } from "react-icons/md";
import Loader from "../components/Loader";
import Boardgame from "../components/Boardgame";
import { DebounceInput } from "react-debounce-input";
import { XMLParser } from "fast-xml-parser";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const [boardgames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getBoardgames = (col, callback) => {
    setLoading(true);
    const q = query(collection(db, col), orderBy("status"), orderBy("createdAt", "desc"));
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
    const stores = query(
      collection(db, "boardgames"),
      where("title", ">=", value),
      where("title", "<=", search + "\uf8ff")
    );
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
    getBoardgameByName(search);
  }, [search]);

  useEffect(() => {
    let unSubscribe;
    if (boardgames.length !== 0) {
      return;
    }
    unSubscribe = getBoardgames("boardgames", setBoardGames);
    return unSubscribe;
  }, []);

  const options = {
    ignoreAttributes: false,
  };

  const updateGames = () => {
    boardgames.forEach(({ id, bggLink, name }) => {
      const gameId = bggLink.split("/")[4];
      fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${gameId}`)
        .then((res) => res.text())
        .then((data) => {
          const parser = new XMLParser(options);
          const {
            items: { item },
          } = parser.parse(data);
          if (item) {
            console.log(item);
            updateDoc(doc(db, "boardgames", id), {
              bggId:gameId
            });
            toast.success("updated " + name);
          } else {
            toast.error("please try again");
          }
        })
        .catch((err) => toast.error(err.message));
    });
  };
  return !loading ? (
    <div className="container">
      {/* {auth.currentUser && <button onClick={updateGames}>update games</button>} */}
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
        {boardgames?.length > 0 ? (
          <div className="gamelist">
            {boardgames
              .filter((game) => !game.isWanted)
              .map((game) => (
                <Boardgame key={game.id} game={game} />
              ))}
          </div>
        ) : (
          <h1>No baordgames found</h1>
        )}
      </div>

      <div className="container">
        <h2>WANTED</h2>
        {boardgames?.length > 0 ? (
          <div className="gamelist">
            {boardgames
              .filter((game) => game.isWanted)
              .map((game) => (
                <Boardgame key={game.id} game={game} />
              ))}
          </div>
        ) : (
          <h1>No baordgames found</h1>
        )}
      </div>
    </div>
  ) : (
    <div className="loader-container">
      <Loader />
    </div>
  );
}

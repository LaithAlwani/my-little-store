import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { MdOutlineSearch } from "react-icons/md";
import Loader from "../components/Loader";
import Boardgame from "../components/Boardgame";

export default function HomePage() {
  const [boardgames, setBoardgames] = useState([]);
  const [wantedBoardgames, setWantedBoardgames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getBoardgames = () => {
    setLoading(true);
    const q = query(
      collection(db, "boardgames"),
      orderBy("isWanted"),
      orderBy("status"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      setBoardgames([]);
      setWantedBoardgames([]);
      querySnapshot.forEach((doc) => {
        if (!doc.data().isWanted) {
          setBoardgames((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        } else {
          setWantedBoardgames((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        }
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    let unSubscribe;
    if (boardgames.length !== 0) {
      return;
    }
    unSubscribe = getBoardgames();
    return unSubscribe;
  }, []);

  return !loading ? (
    <div className="container">
      <div className="search-bar-container">
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
          <h1>No baordgames found</h1>
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
          <h1>No baordgames found</h1>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  );
}

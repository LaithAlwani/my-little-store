import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Boardgame from "../components/Boardgame";
import { db } from "../lib/firebase";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [lookingForList, setLookingForList] = useState([]);

  const fetchBoardgames = (col, callback) => {
    const q = query(collection(db, col), orderBy("status"), orderBy("name"));
    onSnapshot(q, (querySnapshot) => {
      callback([]);
      querySnapshot.forEach((doc) => {
        callback((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
      });
    });
  };

  useEffect(() => {
    let unSubscribe;
    if (!games.length === 0 && !lookingForList.length === 0) {
      return
    }

    unSubscribe = fetchBoardgames("sale-list", setGames);
    unSubscribe = fetchBoardgames("looking-for", setLookingForList);
    
    return unSubscribe;
  }, []);
  return (
    <>
      <div className="container">
        <p className="muted">*** click a game to checkout its BGG page***</p>
      </div>

      <div className="container">
        {games.length > 0 && (
          <div className="gamelist">
            {games.map((game) => (
              <Boardgame key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
      <div className="container">
        <h2>Trade List</h2>
        <p>Boardgames I am in search off.</p>
        <div className="gamelist">
          {lookingForList.map((game) => (
            <Boardgame key={game.id} game={game} />
          ))}
        </div>
      </div>
    </>
  );
}
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
    if (games.length === 0) {
      unSubscribe = fetchBoardgames("sale-list", setGames);
    }

    if (lookingForList.length === 0) {
      unSubscribe = fetchBoardgames("looking-for", setLookingForList);
    }
    return unSubscribe;
  }, []);
  return (
    <>
      <div className="container">
        <h2>
          Prices are negotiable, pick up in{" "}
          <a
            href="https://www.google.com/maps/place/Summerhill+St,+Ottawa,+ON/@45.26683,-75.6979251,17z/data=!3m1!4b1!4m6!3m5!1s0x4ccde31f0d89992b:0xa278a4d7103aff32!8m2!3d45.2668263!4d-75.6953502!16s%2Fg%2F1jkxrrdsf"
            target="_blank"
            className="location">
            RiverSide South
          </a>
          <span className="muted"> click to open google maps</span>
        </h2>
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
        <div className="flex">
          <StautsDot color="green" text="Available" />

          <StautsDot color="yellow" text="Pending" />

          <StautsDot color="red" text="Sold" />
        </div>
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

const StautsDot = ({ color, text }) => {
  return (
    <span className="flex">
      <span className={`dot ${color}`} />
      {text}
    </span>
  );
};

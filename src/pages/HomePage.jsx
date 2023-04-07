import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Boardgame from "../components/Boardgame";
import { db } from "../lib/firebase";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [lookingForList, setLookingForList] = useState([]);
  const [isLookingFor, setIsLookingFor] = useState(false);

  useEffect(() => {
    let unSubscribe;
    
      const q = query(collection(db, "sale-list"), orderBy("status"), orderBy("name"));
      unSubscribe = onSnapshot(q, (querySnapshot) => {
        setGames([]);
        querySnapshot.forEach((doc) => {
          setGames((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        });
      });
    
    if (lookingForList.length === 0 && isLookingFor) {
      const q = query(collection(db, "looking-for"), orderBy("name"));
      unSubscribe = onSnapshot(q, (querySnapshot) => {
        setGames([]);
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          setLookingForList((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        });
      });
    }
    return unSubscribe;
  }, [isLookingFor]);
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
        <div className="flex mx1">
          <span>
            <StautsDot color="green" />
            Available
          </span>
          <span>
            <StautsDot color="yellow" />
            pending
          </span>
          <span>
            <StautsDot color="red" />
            sold
          </span>
        </div>
      </div>
      <div className="container">
        <button onClick={() => setIsLookingFor(!isLookingFor)}>
          {isLookingFor ? "Games for Sale" : "Wanted Games"}
        </button>
      </div>

      {isLookingFor ? (
        <div className="container">
          <h2>Trade List</h2>
          <p>A list of Games Im looking for that can be offered in a trade.</p>
          <div className="gamelist">
            {lookingForList.map((game) => (
              <Boardgame key={game.id} game={game} />
            ))}
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="gamelist">
            {games.map((game) => (
              <Boardgame key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const StautsDot = ({ color }) => {
  return <span className={`dot ${color}`} />;
};

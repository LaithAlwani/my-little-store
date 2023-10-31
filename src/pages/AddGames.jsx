import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../lib/firebase";
import Boardgame from "../components/Boardgame";
import { XMLParser } from "fast-xml-parser";
import Loader from "../components/Loader";
import { UserContext } from "../lib/context";

const options = {
  ignoreAttributes: false,
};

export default function AddGames() {
  const { isAdmin, isLoading } = useContext(UserContext);
  const [price, setPrice] = useState("");
  const [bggLink, setBggLink] = useState("");
  const [boardgames, setBoardgames] = useState([]);
  const [iso, setIso] = useState(false);
  const [condition, setCondition] = useState("like-new");
  const [boxDamage, setBoxDamage] = useState(false);
  const [gameDamage, setGameDamage] = useState(false);
  const [missingPieces, setMissingPieces] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    boardgames.forEach((game) => {
      addDoc(collection(db, "boardgames"), { ...game, createdAt: serverTimestamp() })
        .then(() => {
          toast.success(`${game.name} added!`);

          navigate(`/`);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    });
    setBoardgames([]);
  };

  const getBggGameInfo = (e) => {
    e.preventDefault();
    const id = bggLink.split("/")[4];
    fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}`)
      .then((res) => res.text())
      .then((data) => {
        const parser = new XMLParser(options);
        const {
          items: { item },
        } = parser.parse(data);
        if (item) {
          // const exp = item.link.filter(link => link["@_type"] === 'boardgameexpansion')
          setBoardgames((prevState) => [
            ...prevState,
            {
              name: item.name[0]
                ? item.name[0]["@_value"].toLowerCase()
                : item.name["@_value"].toLowerCase(),
              thumbnail: item.thumbnail,
              image: item.image,
              isExpansion: item["@_type"] === "boardgameexpansion",
              isWanted: iso,
              bggLink,
              bggId: id,
              price,
              status: "available",
              condition: condition,
              missingPieces,
              boxDamage,
              gameDamage,
            },
          ]);
          setBggLink("");
          setPrice("");
        } else {
          toast.error("please try again");
        }
      })
      .catch((err) => toast.error(err.message));
  };

  return isLoading ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : isAdmin ? (
    <form onSubmit={getBggGameInfo} className="form-container">
      <h3>Just paste the boardgames' bgg url and set a price</h3>
      <label htmlFor="">
        <input onChange={() => setIso(!iso)} type="checkbox" placeholder="bbglink" />
        Looking for a game?
      </label>
      <input
        type="text"
        placeholder="bbglink"
        value={bggLink}
        onChange={(e) => setBggLink(e.target.value)}
      />
      {!iso && (
        <>
          <input
            type="number"
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
            required
          />
          <select onChange={(e) => setCondition(e.target.value)}>
            <option value="like-new">Like new</option>
            <option value="used">Used</option>
            <option value="sealed">Sealed</option>
          </select>
          <label htmlFor="">
            <input
              onChange={() => setBoxDamage(!boxDamage)}
              type="checkbox"
              placeholder="bbglink"
            />
            Box damage(dents)
          </label>
          <label htmlFor="">
            <input
              onChange={() => setGameDamage(!gameDamage)}
              type="checkbox"
              placeholder="bbglink"
            />
            Content damage
          </label>
          <label htmlFor="">
            <input
              onChange={() => setMissingPieces(!missingPieces)}
              type="checkbox"
              placeholder="bbglink"
            />
            missing pieces
          </label>
        </>
      )}

      <button>AddGame</button>
      <div className="gamelist">
        {boardgames.map((game, i) => (
          <Boardgame key={i} game={game} />
        ))}
      </div>
      {boardgames.length > 0 && (
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader /> : "Sumbit Games"}
        </button>
      )}
    </form>
  ) : (
    <div className="container">
      <h1>Unauthorized</h1>
    </div>
  );
}

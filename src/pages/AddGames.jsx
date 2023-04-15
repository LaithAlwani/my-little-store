import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import Boardgame from "../components/Boardgame";
import { XMLParser } from "fast-xml-parser";

export default function AddGames() {
  const { user, storeId } = useContext(UserContext);
  const [price, setPrice] = useState("");
  const [bggLink, setBggLink] = useState("");
  const [boardgames, setBoardgames] = useState([]);
  const [iso, setIso] = useState(false);
  const [condition, setCondition] = useState("");
  const [boxDamage, setBoxDamage] = useState(false);
  const [gameDamage, setGameDamage] = useState(false);
  const [missingPieces, setMissingPieces] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentStoreId = location.pathname.split("/")[1];

  const options = {
    ignoreAttributes: false,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    boardgames.forEach((game) => {
      addDoc(collection(db, "stores", currentStoreId, "boardgames"), game)
        .then(() => {
          toast.success(`${game.name} added!`);
          navigate(`/${currentStoreId}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    });
    await updateDoc(
      doc(db, "stores", currentStoreId),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );
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
        console.log(item["@_type"] === "boardgameexpansion");
        if (item) {
          setBoardgames((prevState) => [
            ...prevState,
            {
              storeId,
              name: item.name[0]["@_value"].toLowerCase(),
              image: item.image,
              isExpansion: item["@_type"] === "boardgameexpansion",
              isWanted: iso,
              bggLink,
              price,
              status: "available",
              condition,
              missingPieces,
              boxDamage,
              gameDamage,
            },
          ]);
          setBggLink("");
        setPrice("");
        } else {
          toast.error("please try again")
        }
      })
      .catch((err) => console.log(err));
  };

  return user && storeId === currentStoreId ? (
    <form className="form-container">
      <h3>Just paste the boardgames' bgg url and set a price</h3>
      <label htmlFor="">
        <input onChange={() => setIso(!iso)} type="checkbox" placeholder="bbglink" />
        Looking for a game
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
          />
          <select onChange={(e) => setCondition(e.target.value)}>
            <option defaultChecked>Codition</option>
            <option value="like-new">like new</option>
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

      <button onClick={getBggGameInfo}>AddGame</button>
      <div className="gamelist">
        {boardgames.map((game, i) => (
          <Boardgame key={i} game={game} />
        ))}
      </div>
      {boardgames.length > 0 && <button onClick={handleSubmit}>Sumbit Games</button>}
    </form>
  ) : (
    <div className="container">
      <h1>Unauthorized</h1>
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import Boardgame from "../components/Boardgame";

export default function AddGames() {
  const { user, storeId } = useContext(UserContext);
  const [price, setPrice] = useState("");
  const [bggLink, setBggLink] = useState("");
  const [boardgames, setBoardgames] = useState([]);
  const [iso, setIso] = useState(false);
  const [boxDamage, setBoxDamage] = useState(false);
  const [gameDamage, setGameDamage] = useState(false);
  const [missingPieces, setMissingPieces] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentStoreId = location.pathname.split("/")[1];

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
    fetch(`https://bgg-json.azurewebsites.net/thing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBoardgames((prevState) => [
            ...prevState,
            {
              name: data.name,
              image: data.thumbnail,
              isExpansion: data.isExpansion,
              isWanted: iso,
              bggLink,
              price,
              status: "available",
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
      .catch((err) => toast.error("try again please"));
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
          <select>
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
      <div className="flex">
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

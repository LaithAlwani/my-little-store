import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  arrayUnion,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import Boardgame from "../components/Boardgame";

export default function AddGames() {
  const { user } = useContext(UserContext);
  const [price, setPrice] = useState("");
  const [bggLink, setBggLink] = useState("");
  const [boardgames, setBoardgames] = useState([]);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const storeId = location.pathname.split("/")[1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    boardgames.forEach((game) => {
      addDoc(collection(db, "stores", storeId, "boardgames"), game)
        .then(() => {
          toast.success(`${game.name} added!`);
          navigate(`/${storeId}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    });
    await updateDoc(doc(db, "stores", storeId), { updatedAt: serverTimestamp() }, { merge: true });
    setBoardgames([]);
  };

  const getBggGameInfo = (e) => {
    e.preventDefault();
    const id = bggLink.split("/")[4];
    fetch(`https://bgg-json.azurewebsites.net/thing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBoardgames((prevState) => [
          ...prevState,
          {
            name: data.name,
            image: data.thumbnail,
            isExpansion: data.isExpansion,
            isWanted: checked,
            bggLink,
            price,
            status: "available",
          },
        ]);
        setBggLink("");
        setPrice("");
      });
  };

  return user ? (
    <form className="form-container">
      <h3>Just past the boardgames' bgg link and set a price</h3>
      <label htmlFor="">
        <input onChange={() => setChecked(!checked)} type="checkbox" placeholder="bbglink" />
        Looking for a game
      </label>
      <input
        type="text"
        placeholder="bbglink"
        value={bggLink}
        onChange={(e) => setBggLink(e.target.value)}
      />
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(parseInt(e.target.value))}
        disabled={checked}
      />
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

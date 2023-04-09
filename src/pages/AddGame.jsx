import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { boardgameList } from "../utils/boardgames";
import Boardgame from "../components/Boardgame";

export default function AddGame() {
  const { user } = useContext(UserContext);
  const [price, setPrice] = useState("");
  const [bggLink, setBggLink] = useState("");
  const [gamesArray, setGamesArray] = useState([]);
  const lookingFor = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    gamesArray.forEach((game) => {
      const targetCollection = game.isWanted ? "looking-for" : "sale-list";
      addDoc(collection(db, targetCollection), game)
        .then((docRef) => {
          toast.success("Document written with ID: " + docRef.id);
          setGamesArray([]);
          navigate("/")
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    });
  };

  const uploadBoardgames = () => {
    boardgameList.forEach((game) => {
      addDoc(collection(db, "sale-list"), game)
        .then(() => toast.success(game.name + added))
        .catch((err) => toast.error(err.message));
    });
  };

  const getBggGameInfo = (e) => {
    e.preventDefault();
    const id = bggLink.split("/")[4];
    fetch(`https://bgg-json.azurewebsites.net/thing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGamesArray((prevState) => [
          ...prevState,
          {
            name: data.name,
            image: data.thumbnail,
            isExpansion: data.isExpansion,
            isWanted: lookingFor.current.checked,
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
    <div className="container">
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
      />
      <label htmlFor="">
        <input ref={lookingFor} type="checkbox" placeholder="bbglink" />
        LookingFor?
      </label>

      <button onClick={getBggGameInfo}>AddGame</button>
      {/* <button onClick={uploadBoardgames}>Upload games</button> */}

      <div className="flex">
        {gamesArray.map((game, i) => (
          <Boardgame key={i} game={game} />
        ))}
      </div>
      {gamesArray.length > 0 && <button onClick={handleSubmit}>Sumbit Games</button>}
    </div>
  ) : (
    <div className="container">
      <h1>Unauthorized</h1>
    </div>
  );
}

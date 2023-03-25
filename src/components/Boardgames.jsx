import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { boardgameList } from "../utils/boardgames";

export default function Boardgames({ game }) {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const compare = (a, b) => {
    return a.name < b.name ? -1 : 1;
  };

  const updateGameStatus = async(e, id) => {
    console.log(e.target.value, id)
    try {
      await updateDoc(doc(db,"sale-list", id),{status:e.target.value})
      toast.success("updated to " + e.target.value)
    }
    catch (err) {
      toast.error(err.message)
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-container">
      <div
        className={`status ${
          game.status === "available" ? " green" : game.status === "sold" ? "red" : "yellow"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      />
      <a href={game.bggLink} target="_blank" key={game.id} className="img-container">
        <img src={game.image} alt={game.name} className="bg-image" />
      </a>
      <h3>{game.name}</h3>
      {game.status !== "sold" && <h4>${game.price}</h4>}
      {user?.email === "laithalwani@gmail.com" && isOpen && (
        <div className="model" onChange={(e)=>updateGameStatus(e, game.id)}>
          <select name="" id="">
            <option value="" >Choose Status</option>
            <option value="available" >avialable</option>
            <option value="pending">pending</option>
            <option value="sold">sold</option>
          </select>
        </div>
      )}
    </div>
  );
}

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { MdDeleteForever } from "react-icons/md";
import { email } from "../utils/boardgames";

export default function Boardgame({ game }) {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const price = useState(game.price)

  const boardGameRef = doc(db, "sale-list", game.id)

  const toggleModle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  const updateGameStatus = async (e) => {
    try {
      await updateDoc(boardGameRef, { status: e.target.value });
      toast.success("updated to " + e.target.value);
      setIsOpen(!isOpen);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const changePrice = async (e) => {
    const price = e.target.value
    try {
      await updateDoc(boardGameRef, { price })
      toast.success(`${game.name} price update to ${price}`)
      setIsOpen(!isOpen)
    }
    catch (err) {
      toast.error(err.message)
    }
  }

  const ribbonText = () => {
    if (game.isWanted) {
      return "Wanted"
    } else {
      if (game.status === "available") {
        return `$${game.price}`
      } else if (game.status === "pending") {
        return `$${game.price} PPU`
      }
      return "Sold"
    }
  }

  const deleteBoardgame = async (name, id) => {
    try {
      await deleteDoc(doc(db, "sale-list", id));
      toast.success(name + " deleted");
      setIsOpen(!isOpen);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-container">
      <a href={game.bggLink} target="_blank" key={game.id} className="img-container">
        <img src={game.image} alt={game.name} className="bg-image" />
      </a>
      {<p  className={`ribbon-banner ${
            game.isWanted ? "" : game.status === "available" ? " green" : game.status === "sold" ? "red" : "yellow"
          }`}
          onClick={toggleModle}>{ribbonText()}</p>}

      {user?.email === email && isOpen && (
        <div className="model">
          <select name="" id="" onChange={updateGameStatus}>
            <option value="">Choose Status</option>
            <option value="available">avialable</option>
            <option value="pending">pending</option>
            <option value="sold">sold</option>
          </select>
          <input type="number" placeholder="price" defaultValue={price} onBlur={changePrice} />
          {game.status === "sold" && (
            <button className="deleteBtn" onClick={() => deleteBoardgame(game.name, game.id)}>
              <MdDeleteForever />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import {  deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { MdDeleteForever } from "react-icons/md";

export default function Boardgame({ storeId: currentStoreId, game }) {
  const { id, name, price, image, status, bggLink, isWanted } = game;
  const { user, storeId } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const updateBoardgame = async (e, id, field) => {
    const boardgameRef = doc(db, "stores", currentStoreId, "boardgames", id);
    const newValue = e.target.value;
    try {
      await updateDoc(boardgameRef, { [field]: newValue },  {merge:true});
      await updateDoc(doc (db,"stores", currentStoreId),{updatedAt:serverTimestamp()}, {merge:true})
      toast.success(`${name} update ${field} to ${newValue}`);
      setIsOpen(!isOpen);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteBoardgame = async () => {
    const boardgameRef = doc(db, "stores", currentStoreId, "boardgames", id);
    try {
      await deleteDoc(boardgameRef);
      toast.success(name + " deleted");
      setIsOpen(!isOpen);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-container">
      <a href={bggLink} target="_blank" key={id} className="img-container">
        <img src={image} alt={name} className="bg-image" />
      </a>
      <div onClick={toggleModle}>
        <Ribbon status={status} isWanted={isWanted} price={price} />
      </div>
      {user && storeId === currentStoreId && isOpen && (
        <div className="model">
          <select name="" id="" onChange={(e) => updateBoardgame(e, game.id, "status")}>
            <option value="">Choose Status</option>
            {game.status !== "available" && <option value="available">avialable</option>}
            {game.status !== "pending" && <option value="pending">pending</option>}
            {game.status !== "sold" && <option value="sold">sold</option>}
          </select>
          <input
            type="number"
            placeholder="price"
            defaultValue={price}
            onBlur={(e) => updateBoardgame(e, game.id, "price")}
          />
          {(status === "sold" || isWanted) && (
            <button className="deleteBtn" onClick={deleteBoardgame}>
              <MdDeleteForever />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const Ribbon = ({ status, isWanted, price }) => {
  const updateRibbonText = () => {
    if (isWanted) {
      return "Wanted";
    } else {
      if (status === "available") {
        return `$${price}`;
      } else if (status === "pending") {
        return `$${price} PPU`;
      }
      return status.toUpperCase();
    }
  };
  return (
    <p
      className={`ribbon-banner ${
        isWanted ? "" : status === "available" ? " green" : status === "sold" ? "red" : "yellow"
      }`}>
      {updateRibbonText()}
    </p>
  );
};

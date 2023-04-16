import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { MdInfo } from "react-icons/md";
import RemoveBoardgame from "./RemoveBoardgame";
import Ribbon from "./Ribbon";
import Tag from "./Tag";

export default function Boardgame({ storeId: currentStoreId, game }) {
  const {
    id,
    name,
    price,
    image,
    status,
    bggLink,
    isWanted,
    condition,
    missingPieces,
    gameDamage,
    boxDamage,
    description,
  } = game;
  const { user, storeId } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleModle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  const toggleInfoModel = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  const updateBoardgame = async (e, id, field) => {
    const boardgameRef = doc(db, "stores", currentStoreId, "boardgames", id);
    const newValue = e.target.value;
    try {
      await updateDoc(boardgameRef, { [field]: newValue }, { merge: true });
      await updateDoc(
        doc(db, "stores", currentStoreId),
        { updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success(`${name} update ${field} to ${newValue}`);
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
      <MdInfo size={24} className="bg-info" onClick={toggleInfoModel} />
      {isInfoOpen && (
        <div className="model">
          <div className="tags">
            <Tag value={condition} color="green" />
            <Tag value={gameDamage ? "damaged" : null} color="orange" />
            <Tag value={boxDamage ? "box damage" : null} color="blue" />
            <Tag value={missingPieces ? "missing components" : null} color="red" />
            {description && <p className="text-left">{description}</p>}
          </div>
        </div>
      )}
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
            <button className="deleteBtn">
              <RemoveBoardgame id={game.id} storeId={currentStoreId} name={game.name} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

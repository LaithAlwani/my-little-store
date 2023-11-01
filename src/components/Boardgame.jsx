import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../lib/firebase";
import RemoveBoardgame from "./RemoveBoardgame";
import Ribbon from "./Ribbon";
import Tag from "./Tag";
import { UserContext } from "../lib/context";
import { useParams } from "react-router-dom";

export default function Boardgame({ game }) {
  const {
    id,
    name,
    price,
    thumbnail,
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
  const { storeId } = useParams();
  const { user, isAdmin } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleModle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const updateBoardgame = async (e, id, field) => {
    const boardgameRef = doc(db, "stores", storeId, "boardgames", id);
    const newValue = e.target.value;
    try {
      await updateDoc(boardgameRef, { [field]: newValue }, { merge: true });
      await updateDoc(doc(db, "stores", storeId), {
        last_updated: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      toast.success(`${name} update ${field} to ${newValue}`);
      setIsOpen(!isOpen);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    game && (
      <div className="bg-container">
        <a href={bggLink} target="_blank" key={id} className="img-container">
          <img src={thumbnail} alt={name} className="bg-image" />
          <h3>{name}</h3>
        </a>
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
        {user && isAdmin && isOpen && (
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
            {(status === "sold" || isWanted) && <RemoveBoardgame id={game.id} name={game.name} />}
          </div>
        )}
      </div>
    )
  );
}

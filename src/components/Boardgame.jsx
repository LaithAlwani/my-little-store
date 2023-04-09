import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { MdDeleteForever } from "react-icons/md";

export default function Boardgame({ game }) {
  const{id, name, price, image, status, bggLink, isWanted } = game
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const updateBoardgame = async(e, field) => {
    const boardGameRef = doc(db, "sale-list", id);
    const newValue = e.target.value
    try {
      await updateDoc(boardGameRef, { [field]: newValue });
      toast.success(`${name} price update to ${newValue}`);
      setIsOpen(!isOpen);
    }
    catch (err) {
      toast.error(err.message);
    }
  }

  const deleteBoardgame = async (id, name, wanted) => {
    try {
      const tragetCollection = wanted ? "looking-for" : "sale-list";
      await deleteDoc(doc(db, tragetCollection, id));
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
      {user && isOpen && (
        <div className="model">
          <select name="" id="" onChange={(e)=>updateBoardgame(e, "status")}>
            <option value="">Choose Status</option>
            <option value="available">avialable</option>
            <option value="pending">pending</option>
            <option value="sold">sold</option>
          </select>
          <input type="number" placeholder="price" defaultValue={price} onBlur={(e)=>updateBoardgame(e, "price")} />
          {(status === "sold" || isWanted) && (
            <button
              className="deleteBtn"
              onClick={() => deleteBoardgame(id, name, isWanted)}>
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
        return `$${price} - PPU`;
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

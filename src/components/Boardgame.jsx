import {  deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { MdDeleteForever } from "react-icons/md"
import { email } from "../utils/boardgames";

export default function Boardgame({ game }) {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const updateGameStatus = async(e, id) => {
    try {
      await updateDoc(doc(db,"sale-list", id),{status:e.target.value})
      toast.success("updated to " + e.target.value)
      setIsOpen(!isOpen)
    }
    catch (err) {
      console.log(err)
      toast.error(err.message)
    }
    
  }

  const deleteBoardgame = async(name, id)=>{
    try{
      await deleteDoc(doc(db, "sale-list", id));
      toast.success(name + " deleted");
      setIsOpen(!isOpen)
    }
    catch (err) {
      console.log(err)
      toast.error(err.message);
    }
  }

  return (
    <div className="bg-container">
      {!game.isWanted &&<div
        className={`status ${
          game.status === "available" ? " green" : game.status === "sold" ? "red" : "yellow"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      />}
      <a href={game.bggLink} target="_blank" key={game.id} className="img-container">
        <img src={game.image} alt={game.name} className="bg-image" />
      </a>
      <h3>{game.name}</h3>
      {game.status !== "sold" && !game.isWanted && <h4>${game.price}</h4>}
      {user?.email === email && isOpen && (
        <div className="model" onChange={(e)=>updateGameStatus(e, game.id)}>
          <select name="" id="">
            <option value="" >Choose Status</option>
            <option value="available" >avialable</option>
            <option value="pending">pending</option>
            <option value="sold">sold</option>
          </select>
          {game.status === "sold" && <button className="deleteBtn" onClick={()=>deleteBoardgame(game.name,game.id)}>
            <MdDeleteForever />
          </button>}
        </div>
      )}
    </div>
  );
}

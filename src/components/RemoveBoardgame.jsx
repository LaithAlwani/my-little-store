import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { MdDeleteOutline } from "react-icons/md";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function RemoveBoardgame({ game }) {
  const { storeId } = useParams();
  const deleteBoardgame = async () => {
    const storeRef = doc(db, "stores", storeId);
    try {
      if (game.isWanted) {
        await updateDoc(storeRef, { boardgamesWanted: arrayRemove(game) });
      } else {
        await updateDoc(storeRef, { boardgamesSale: arrayRemove(game) });
      }
      toast.success(game.name + " deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <button className="deleteBtn" onClick={deleteBoardgame}>
      <MdDeleteOutline color="white" size={24} />
    </button>
  );
}

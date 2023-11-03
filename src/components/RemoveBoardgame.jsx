import { deleteDoc, doc } from "firebase/firestore";
import { MdDeleteOutline } from "react-icons/md";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function RemoveBoardgame({ id, name }) {
  const {storeId} = useParams()
  const deleteBoardgame = async () => {
    const boardgameRef = doc(db,"stores", storeId, "boardgames", id);
    try {
      await deleteDoc(boardgameRef);
      toast.success(name + " deleted");
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

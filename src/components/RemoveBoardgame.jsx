import { deleteDoc, doc } from "firebase/firestore";
import { MdDeleteOutline } from "react-icons/md";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";

export default function RemoveBoardgame({ id, name }) {
  const deleteBoardgame = async () => {
    const boardgameRef = doc(db, "boardgames", id);
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

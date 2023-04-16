import { deleteDoc, doc } from "firebase/firestore";
import { MdDeleteOutline } from "react-icons/md";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";


export default function RemoveBoardgame({ id, storeId, name }) {
  const deleteBoardgame = async () => {
    console.log("working")
    const boardgameRef = doc(db, "stores", storeId, "boardgames", id);
    try {
      await deleteDoc(boardgameRef);
      toast.success(name + " deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return <MdDeleteOutline color="white" size={24} onClick={deleteBoardgame} />;
}

import { Timestamp, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../lib/firebase";

const StoreCreate = () => {
  const [storeName, setStoreName] = useState("");
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const newStore = {
      storeName, 
      userId: auth.currentUser.uid,
      views: 0,
      numGames: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }
    const docRef = await addDoc(collection(db, "stores"), { ...newStore });
    console.log("Document written with ID: ", docRef.id);
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input type="text" placeholder="Store Name" onChange={(e) => setStoreName(e.target.value)} />
      <button>Create Store</button>
    </form>
  );
};

export default StoreCreate;

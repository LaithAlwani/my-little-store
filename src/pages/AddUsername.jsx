import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddUsername = () => {
  const [bggUsername, setBggUsername] = useState("");
  const navigate = useNavigate()
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      
      await setDoc(doc(db, "users", auth.currentUser.uid), { username:bggUsername },{merge:true});
      toast.success("BGG Username added");
      navigate('/')
    }
    catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input type="text" placeholder="bgg username" onChange={(e) => setBggUsername(e.target.value)} />
      <button>Add BGG Username</button>
    </form>
  );
};

export default AddUsername;

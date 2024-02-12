import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddUserInformation = () => {
  const [bggUsername, setBggUsername] = useState("");
  const [fbHnadle, setFbHandle] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {  
      await setDoc(doc(db, "users", auth.currentUser.uid), { username:bggUsername, fbHandle:fbHnadle, pickupLocation, postalcode },{merge:true});
      toast.success("BGG Username added");
      navigate('/')
    }
    catch (err) {
      toast.error(err.message);
    }
  };
  return auth.currentUser ? (
    <form onSubmit={handleSubmit} className="form-container">
      <input type="text" placeholder="bgg username" onChange={(e) => setBggUsername(e.target.value)} />
      <input type="text" placeholder="Facebook profile url" onChange={(e) => setFbHandle(e.target.value.split("/")[3])} />
      <input type="text" placeholder="Area Name" onChange={(e) => setPickupLocation(e.target.value)} />
      <input type="text" placeholder="postal code" onChange={(e) => setPostalcode(e.target.value)} />
      <button>Add BGG Username</button>
    </form>
  ):(<h1>Please login</h1>);
};

export default AddUserInformation;

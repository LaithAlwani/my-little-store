import { useNavigate } from "react-router-dom";
import { doc, addDoc, collection } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";

export default function CreateStore() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const createStore = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      return toast.error("please enter store and location")
    }
    addDoc(collection(db, "stores"), { location, name, uid:user.uid })
      .then((docRef) => {
        toast.success("Store created!");
        setName("");
        setLocation("");
        navigate(`/${docRef.id}/addgames`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return user ? (
    <form onSubmit={createStore} className="form-container">
      <h1>Create your own store</h1>
      <h3>Let's get started with your store name and an approximate pickup location</h3>
      <input type="text" placeholder="Store Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="location" onChange={(e) => setLocation(e.target.value)} />
      <button>Create</button>
    </form>
  ) : (
    <h1 className="container">Unauthorized</h1>
  );
}

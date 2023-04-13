import { useNavigate } from "react-router-dom";
import { doc, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";

export default function CreateStore() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [facebook, setFacebook] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const createStore = async (e) => {
    e.preventDefault();
    if (!name || !facebook) {
      return toast.error("please enter store name and facebook url");
    }
    addDoc(collection(db, "stores"), {
      location,
      name,
      uid: user.uid,
      facebook,
      updatedAt: serverTimestamp(),
    })
      .then((docRef) => {
        updateDoc(doc(db, "users", user.uid), { storeId: docRef.id }).then(() => {
          toast.success("Store created!");
          setName("");
          setLocation("");
          navigate(`/${docRef.id}/addgames`);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return user ? (
    <form onSubmit={createStore} className="form-container">
      <h1>Create your own store</h1>
      <h3>Let's get started with your store name, Facebook url and an approximate pickup location on google maps</h3>
      <input type="text" placeholder="Store Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="facebook" onChange={(e) => setFacebook(e.target.value)} />
      <input type="text" placeholder="location" onChange={(e) => setLocation(e.target.value)} />
      <button>Create</button>
    </form>
  ) : (
    <h1 className="container">Unauthorized</h1>
  );
}

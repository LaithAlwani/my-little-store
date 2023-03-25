import { signOut } from "firebase/auth";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../lib/context";
import { auth, db } from "../lib/firebase";
import { boardgameList } from "../utils/boardgames";

export default function AddGame() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [bbglink, setBggLink] = useState("");
  const isExpansion = useRef();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const boardgame = {
      name,
      image,
      price,
      bbglink,
      status: "available",
      isExpansion: isExpansion.current.checked,
    };
    addDoc(collection(db, "sale-list"), boardgame)
      .then((docRef) => {
        console.log(docRef.id);
        toast.success("Document written with ID: " + docRef.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  
  

  return (
    <div className="container">
      {user?.email === "laithalwani@gmail.com" ? 
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="name" onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="image" onChange={(e) => setImage(e.target.value)} />
        <input type="number" placeholder="price" onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="bbglink" onChange={(e) => setBggLink(e.target.value)} />

        <label htmlFor="">
          <input ref={isExpansion} type="checkbox" placeholder="bbglink" />
          is Expansion?
        </label>

        <button>submit</button>
        </form>
        :
        <h1>Unauthorized</h1>
      }
    </div>
  );
}

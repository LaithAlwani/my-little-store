import React, { useEffect, useState } from "react";

import Loader from "../components/Loader";

import StoreFront from "../components/StoreFront";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import toast from "react-hot-toast";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, "users"))
      .then((querySnapshot) => {
        setUsers([]);
        querySnapshot.forEach((doc) => {
          setUsers((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
        });
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <section className="container ">
      {users.length > 0 &&
        users.map((user) => (
          <>
            <StoreFront key={user.id} user={user} />
          </>
        ))}
    </section>
  );
};

export default HomePage;

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  collectionGroup,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import Store from "../components/Store";
import { BsHouseAddFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";

export default function HomePage() {
  const { user, storeId } = useContext(UserContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);

  const fetchStores = (col, callback) => {
    setLoading(true);
    const q = query(collection(db, col), orderBy("updatedAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      callback([]);
      querySnapshot.forEach((doc) => {
        callback((prevState) => [...prevState, { id: doc.id, ...doc.data() }]);
      });
      setLoading(false);
    });
  };

  const getBoardGameByName = async (search) => {
    const stores = query(collectionGroup(db, "boardgames"), where("name", ">=", search));
    const querySnapshot = await getDocs(stores);
    console.log(querySnapshot.empty);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {

    let unSubscribe;
    if (stores.length !== 0) {
      return;
    }
    unSubscribe = fetchStores("stores", setStores);
    return unSubscribe;
  }, []);
  return !loading ? (
    <div className="container">
      <input type="text" onChange={(e)=>setSearch(e.target.value)} placeholder="search boardgames" value={search} onBlur={()=>getBoardGameByName(search)} />
      <div className="gamelist">
        {!storeId && user && (
          <Link to="create" className="bg-container">
            <BsHouseAddFill size={64} />
            <h3>Create Store</h3>
          </Link>
        )}
        {stores.length > 0 ? (
          stores.map((store) => <Store key={store.id} store={store} />)
        ) : (
          <h1>No Stores Found</h1>
        )}
      </div>
    </div>
  ) : (
    <Loader />
  );
}

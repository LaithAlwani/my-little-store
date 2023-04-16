import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import Store from "../components/Store";
import { BsHouseAddFill } from "react-icons/bs";
import { MdOutlineSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";

export default function HomePage() {
  const { user, storeId } = useContext(UserContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    if (!search) {
      return fetchStores("stores", setStores);
    }
    setLoading(true);
    const stores = query(collectionGroup(db, "boardgames"), where("name", ">=", search));
    const querySnapshot = await getDocs(stores);
    if (!querySnapshot.empty) {
      return querySnapshot.forEach((docSnapshot) => {
        setStores([]);
        getDoc(doc(db, "stores", docSnapshot.data().storeId)).then((docRef) => {
          setStores((prevState) => [...prevState, { id: docRef.id, ...docRef.data() }]);
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
    }
    return setStores([]);
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
      <div className="search-bar-container">
        <MdOutlineSearch size={32} onClick={() => setIsSearching(!isSearching)} />
        <input
          type="text"
          className={isSearching ? "search-bar searching" : "search-bar"}
          placeholder="search boardgame"
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => getBoardGameByName(search)}
          value={search}
        />
      </div>
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
    <div className="loader-container">
      <Loader />
    </div>
  );
}

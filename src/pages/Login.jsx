import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { addDoc, doc, getDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  const loginWithProvider = async (provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      toast.success("Welcome " + user.displayName);
      getDoc(doc(db, "users", user.uid))
        .then((docRef) => {
          if (!docRef.exists()) {
            addDoc(collection(db, "stores"), {
              ownerId: user.uid,
              name: user.displayName.replace(" ", "").toLowerCase(),
              email: user.email,
              avatar: user.photoURL,
              views: 0,
              numGames: 0,
              created_at: serverTimestamp(),
              updated_at: null,
              last_updated: serverTimestamp(),
            })
              .then(() => {
                toast.success("Store Created");
                navigate(`stores/${storeRef.id}`);
              })
              .catch((err) => toast.error(err.message));
          }
        })
        .catch((err) => console.log(err));
      navigate(`/`);
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The credential that was used.
      const credential = OAuthProvider.credentialFromError(error);
      toast.error(error.message);
    }
  };

  const logInWithGoogle = async () => {
    loginWithProvider(new GoogleAuthProvider());
  };

  return (
    <div className="container">
      <button onClick={logInWithGoogle}>Login with Google</button>
    </div>
  );
}

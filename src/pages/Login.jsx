import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Login() {
  const navigate = useNavigate();
  const {user} =useContext(UserContext)

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
              .then((docRef) => {
                toast.success("Store has been Created please login again");
                signOut(auth)
                  .then(() => {
                    // toast.success("Logged out");
                    navigate("/login");
                  })
                  .catch((err) => {
                    toast.error(err.message);
                  });
              })
              .catch((err) => toast.error(err.message));
          } else {
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
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

  if (user) {
    navigate(-1);
  }

  return (
    <div className="container">
      <button onClick={logInWithGoogle}>Login with Google</button>
      <h2>Only The first time you login, your store will be created and you will be logged out</h2>
    </div>
  );
}

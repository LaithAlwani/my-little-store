import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, addDoc, collection, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();

  const loginWithProvider = async (provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      toast.success("Welcome " + user.displayName);
      getDoc(doc(db, "users", user.uid))
        .then((docRef) => {
          if (!docRef.exists()) {
            setDoc(doc(db, "users", user.uid), {
              email: user.email,
              avatar: user.photoURL,
              displayName: user.displayName,
              created_at: serverTimestamp(),
              updated_at: serverTimestamp(),
              lastlogin: serverTimestamp(),
            })
            .then(() => {
              toast.success("Profile Successfully created");
              navigate(`/add-user-information`);
            })
            .catch((err) => toast.error(err.message));
          } else {
            navigate(`/`);
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

  return (
    <div className="container">
      <button onClick={logInWithGoogle}>
        <FcGoogle size={24} /> Login
      </button>
    </div>
  );
}

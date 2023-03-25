import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";

export default function Login() {
  const navigate = useNavigate();

  const loginWithProvider = async (provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      toast.success("Welcome " + user.email);
      navigate("/add");
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

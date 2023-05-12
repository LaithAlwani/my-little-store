import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { MdLogin, MdLogout, MdPostAdd } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <nav>
      <Link to="/" className="navLink">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5052/5052121.png"
          alt="dice"
          className="logo"
        />
      </Link>
      <div>
        <h3>My Little Shop!</h3>
        <span className="muted">Prices are negotiable</span>
      </div>

      <div className="links">
        {user && (
          <>
            <Link to="addgames" className="navLink">
              <MdPostAdd size={32} />
            </Link>
            <Link to="profile" className="navLink">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="avatar" />
              ) : (
                <FaUserCircle size={32} />
              )}
            </Link>
            <Link to="/" onClick={logout} className="navLink">
              <MdLogout size={32} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

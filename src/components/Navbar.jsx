import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { MdLogin, MdLogout, MdStore } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user, userStoreId } = useContext(UserContext);
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
        <div>
          <h3>Ottawa/Gatinue Boardgame Market</h3>
          <span className="muted">List boardgames for sale!</span>
        </div>
      </Link>

      <div className="links">
        {user ? (
          <>
            <Link to={`/stores/${userStoreId}`}>
              <MdStore size={32} />
            </Link>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="avatar" />
            ) : (
              <FaUserCircle size={32} />
            )}
            <Link to="/" onClick={logout} className="navLink">
              <MdLogout size={32} />
            </Link>
          </>
        ) : (
          <Link to="login" className="navLink">
            <MdLogin size={32} />
          </Link>
        )}
      </div>
    </nav>
  );
}

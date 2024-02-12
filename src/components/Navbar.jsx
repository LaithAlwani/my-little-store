import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { MdLogin, MdLogout, MdStore } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user, userStoreId } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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
          <h3>Boardgame Stop</h3>
          <span className="muted">Ottawa/Gatinue Boardgame Market</span>
        </div>
      </Link>

      {user ? (
        <div className="links">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="avatar" />
          ) : (
            <FaUserCircle size={32} />
          )}
          <Link to="/" onClick={logout} className="navLink">
            <MdLogout size={32} />
          </Link>
        </div>
      ) : (
        <Link to="login" className="navLink" style={{ marginLeft: "auto" }}>
          <MdLogin size={32} />
        </Link>
      )}
      {user && (
        <div className="mobile-links" onClick={() => setIsOpen(!isOpen)}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="avatar" />
          ) : (
            <FaUserCircle size={32} />
          )}
          <div className={`mobile-menu ${isOpen ? "open-menu" : ""}`}>
            <Link to="/" onClick={logout} className="navLink">
              <MdLogout size={32} /> Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

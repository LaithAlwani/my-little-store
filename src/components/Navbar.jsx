import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { MdLogin, MdLogout, MdAddTask } from "react-icons/md";

import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user } = useContext(UserContext);
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
      <h3>My Little Shop!</h3>
      {user && (
        <div className="links">
          {!user && (
            <Link to="signin" className="navLink">
              <MdLogin />
            </Link>
          )}
          {user && (
            <>
              <Link to="add" className="navLink">
                <MdAddTask size={24} />
              </Link>
              <Link to="/" onClick={logout} className="navLink">
                <MdLogout size={24} />
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

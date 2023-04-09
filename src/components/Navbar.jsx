import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { MdLogin, MdLogout, MdPostAdd, MdLocationOn } from "react-icons/md";

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
      <div>
        <h3>My Little Shop!</h3>
        <span className="muted">Prices are negotiable</span>
      </div>

      <div className="links">
        {/* {!user && (
            <Link to="login" className="navLink">
              <MdLogin size={24}/>
            </Link>
          )} */}
        {user && (
          <>
            <Link to="add" className="navLink">
              <MdPostAdd size={24} />
            </Link>
            <Link to="/" onClick={logout} className="navLink">
              <MdLogout size={24} />
            </Link>
          </>
        )}
        <a
          href="https://www.google.com/maps/place/Summerhill+St,+Ottawa,+ON/@45.26683,-75.6979251,17z/data=!3m1!4b1!4m6!3m5!1s0x4ccde31f0d89992b:0xa278a4d7103aff32!8m2!3d45.2668263!4d-75.6953502!16s%2Fg%2F1jkxrrdsf"
          target="_blank"
          className="location">
          <MdLocationOn size={32} />
          <strong>Pickup</strong>
        </a>
      </div>
    </nav>
  );
}

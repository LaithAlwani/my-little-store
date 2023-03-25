import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddGame from "./pages/AddGame";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { UserContext } from "./lib/context";
import { useUserData } from "./lib/hooks";
import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"

function App() {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Router>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddGame />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddGames from "./pages/AddGames";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { useUserData } from "./lib/hooks";
import { UserContext } from "./lib/context";
import "./App.css";

function App() {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Router>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="addgames" element={<AddGames />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

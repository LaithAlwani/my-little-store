import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddGames from "./pages/AddGames";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="addgames" element={<AddGames />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

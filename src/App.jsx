import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StoreFront from "./components/StoreFront";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { useUserData } from "./lib/hooks";
import { UserContext } from "./lib/context";
import "./App.css";
import HomePage from "./pages/HomePage";
import AddUserInformation from "./pages/AddUserInformation";

function App() {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Router>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-user-information" element={<AddUserInformation />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

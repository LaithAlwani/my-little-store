import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddGames from "./pages/AddGames";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { UserContext } from "./lib/context";
import { useUserData } from "./lib/hooks";
import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"
import CreateStore from "./pages/CreateStore";
import StoreFront from "./pages/StoreFront";

function App() {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Router>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path=":store_id" element={<StoreFront />} />
          <Route path=":store_id/addgames" element={<AddGames />} />
          <Route path="login" element={<Login />} />
          <Route path="create" element={<CreateStore />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

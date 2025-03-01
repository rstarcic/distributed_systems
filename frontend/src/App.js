import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Recipes from "./pages/Recipes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={ <Login /> }></Route>
          <Route path="/signup" element={ <Signup/> }></Route>
          <Route path="/recipes" element={ <Recipes/> }></Route>
        </Routes>
      </Router>
    </>   
  );
      
}

export default App;

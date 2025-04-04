import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import RecipeCreation from "./pages/RecipeCreation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/recipes/create" element={<RecipeCreation />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

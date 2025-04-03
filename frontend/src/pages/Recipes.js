import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeList from "../components/RecipeList";
import { Drawer, Typography } from "@mui/material";
import { RecipeFilters } from "../components/RecipeFilters";
import axios from "axios";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRandomRecipeVisible, setIsRandomRecipeVisible] = useState(false);

  const handleApplyFilters = (selectedFilters) => {
    console.log("Selected Filters:", selectedFilters);
    if (selectedFilters.randomRecipe) {
      fetchRandomRecipe();
    } else {
      setIsRandomRecipeVisible(false);
      console.log(selectedFilters);
      fetchFilteredRecipes(selectedFilters);
    }
  };

  const buildQueryParams = (filters) => {
    console.log("FILTERSSS: ", filters.dishType);
    const params = new URLSearchParams();

    if (filters.ingredients && filters.ingredients.length > 0) {
      filters.ingredients.forEach((ingredient) => {
        params.append("ingredients", ingredient);
      });
    }

    if (filters.avoidIngredients && filters.avoidIngredients.length > 0) {
      filters.avoidIngredients.forEach((ingredient) => {
        params.append("avoid", ingredient);
      });
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      filters.difficulty.forEach((difficulty_level) => {
        params.append("difficulty", difficulty_level);
      });
    }

    if (filters.dishType) {
      params.append("dish_type", filters.dishType);
    }

    if (filters.maxTime) {
      params.append("max_time", filters.maxTime);
    }

    if (filters.maxIngredients) {
      params.append("max_ingredients", filters.maxIngredients);
    }

    if (filters.matchAll !== undefined) {
      params.append("match_all", filters.matchAll);
    }

    return params;
  };

  const fetchFilteredRecipes = async (filters) => {
    console.log("Kreće slanje zahtjeva.. ", filters);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const queryParams = buildQueryParams(filters);

      const response = await axios.get("http://127.0.0.1:8002/recipes/filter", {
        headers,
        params: queryParams,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Dobiveni recepti: ", data);
        setRecipes(data);
      } else {
        throw new Error("Failed to fetch recipes, server returned an error");
      }
    } catch (error) {
      console.error("Greška kod dohvaćanja recepata:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomRecipe = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get("http://127.0.0.1:8002/recipes/random", { headers });
      setRandomRecipe(response.data);
      setIsRandomRecipeVisible(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
      setError("Failed to load random recipe");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get("http://127.0.0.1:8002/recipes", { headers });
        console.log(response.data);
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load recipes");
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <div className="recipes-container">
      <SearchBar></SearchBar>
      <Drawer variant="permanent" anchor="left">
        <RecipeFilters onFilter={handleApplyFilters} />
      </Drawer>
      {isRandomRecipeVisible && !loading ? <RecipeList recipes={[randomRecipe]} loading={loading} /> : <RecipeList recipes={recipes} loading={loading} />}
    </div>
  );
};

export default Recipes;

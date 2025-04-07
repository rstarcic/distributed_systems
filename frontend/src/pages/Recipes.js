import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeList from "../components/RecipeList";
import { Box, Drawer, Snackbar, Alert } from "@mui/material";
import { RecipeFilters } from "../components/RecipeFilters";
import { useDebounce } from "../hooks/useDebounce";
import axios from "axios";

const CLASSIC_URL = "http://localhost/classic";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRandomRecipeVisible, setIsRandomRecipeVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 600);

  const handleApplyFilters = (selectedFilters) => {
    if (selectedFilters.randomRecipe) {
      fetchRandomRecipe();
    } else {
      setIsRandomRecipeVisible(false);
      fetchFilteredRecipes(selectedFilters);
    }
  };

  const buildQueryParams = (filters) => {
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
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const queryParams = buildQueryParams(filters);

      const response = await axios.get(`${CLASSIC_URL}/recipes/filter`, {
        headers,
        params: queryParams,
      });

      if (response.status === 200) {
        const data = response.data;
        setRecipes(data);
      } else {
        throw new Error("Failed to fetch recipes, server returned an error");
      }
    } catch (error) {
      setError("Failed to fetch recipes. Please try again later.");
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
      const response = await axios.get(`${CLASSIC_URL}/recipes/random`, { headers });
      setRandomRecipe(response.data);
      setIsRandomRecipeVisible(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
      setError("Failed to load random recipe.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${CLASSIC_URL}/recipes`, { headers });
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

  const filteredRecipes =
    searchText.trim() === "" ? recipes : recipes.filter((recipe) => recipe.name.toLowerCase().includes(debouncedSearchText.toLowerCase()));

  useEffect(() => {
    if (filteredRecipes.length === 0 && !loading) {
      setOpenSnackbar(true);
    }
  }, [filteredRecipes, loading]);

  return (
    <div className="recipes-container">
      <SearchBar
        onSearch={(searchText) => {
          setSearchText(searchText);
        }}
      ></SearchBar>
      <Drawer variant="permanent" anchor="left">
        <RecipeFilters onFilter={handleApplyFilters} />
      </Drawer>
      <Box>
        {error && !loading ? (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="error">
              {error}
            </Alert>
          </Snackbar>
        ) : filteredRecipes.length === 0 && !loading ? (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="info">
              Oops! Looks like we don’t have what you’re looking for...
              <br />
              Try some different ingredients, or maybe adjust your filters a bit!
            </Alert>
          </Snackbar>
        ) : isRandomRecipeVisible && !loading ? (
          <RecipeList recipes={[randomRecipe]} loading={loading} />
        ) : (
          <RecipeList recipes={filteredRecipes} loading={loading} />
        )}
      </Box>
    </div>
  );
};

export default Recipes;

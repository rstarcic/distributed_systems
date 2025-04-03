import React, { useState, useEffect } from "react";
import { Drawer, InputAdornment, Chip, FormLabel, Box, FormControl, TextField, Button, CircularProgress, Autocomplete, Typography } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import axios from "axios";

export function RecipeFilters({ onFilter }) {
  const [dishType, setDishType] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [avoidIngredients, setAvoidIngredients] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [maxTime, setMaxTime] = useState("");
  const [maxIngredients, setMaxIngredients] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(false);
  const [matchAll, setMatchAll] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get("http://127.0.0.1:8002/recipes/ingredients", { headers });
        setAvailableIngredients(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const filterParams = { dishType, ingredients, avoidIngredients, difficulty, maxTime, maxIngredients, matchAll };
    onFilter(filterParams);
    console.log("Slanje parametara u parent: ", filterParams);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleDishTypeClick = (type) => {
    setDishType(type);
  };

  const handleDifficultyClick = (level) => {
    setDifficulty((prev) => (prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level]));
  };

  const handleMatchAllToggle = () => {
    setMatchAll((prev) => !prev);
  };

  const handleRandomClick = () => {
    setRandomRecipe((prev) => !prev);
    onFilter({ randomRecipe: !randomRecipe });
  };

  const handleResetFilters = () => {
    setDishType("");
    setIngredients([]);
    setAvoidIngredients([]);
    setDifficulty([]);
    setMaxTime("");
    setMaxIngredients("");
    setMatchAll(false);
    setRandomRecipe(false);
    onFilter({ dishType: "", ingredients: [], avoidIngredients: [], difficulty: [], maxTime: "", maxIngredients: "", matchAll: false, randomRecipe: false });
  };

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 300, bgcolor: "#f4f4f4" }}>
      <Typography variant="h6" sx={{ mb: 3, mt: 3, textAlign: "center", fontWeight: "bold", color: "#333" }}>
        Recipe Filters
      </Typography>

      <Box component="form" onSubmit={handleFilterChange} sx={{ padding: "0 16px" }}>
        <Button
          variant="outlined"
          color={randomRecipe ? "primary" : "secondary"}
          fullWidth
          onClick={handleRandomClick}
          sx={{ mt: 2 }}
          startIcon={<ShuffleIcon />}
        >
          Random Recipe
        </Button>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ fontWeight: "bold", color: "#333" }}>Dish Type</FormLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {["breakfast", "lunch", "dinner", "salad", "dessert"].map((type) => (
              <Chip
                key={type}
                label={type}
                clickable
                color={dishType === type ? "primary" : "secondary"}
                onClick={() => handleDishTypeClick(type)}
                sx={{ padding: 1, cursor: "pointer" }}
              />
            ))}
          </Box>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ fontWeight: "bold", color: "#333" }}>Difficulty Level</FormLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 1 }}>
            {["easy", "medium", "hard"].map((level) => (
              <Chip
                key={level}
                label={level}
                clickable
                color={difficulty.includes(level) ? "primary" : "secondary"}
                onClick={() => handleDifficultyClick(level)}
                sx={{ padding: 1, cursor: "pointer" }}
              />
            ))}
          </Box>
        </FormControl>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <FormLabel sx={{ fontWeight: "bold", color: "#333" }}>Ingredients</FormLabel>
              <Autocomplete
                multiple
                id="ingredients"
                options={availableIngredients}
                value={ingredients}
                onChange={(event, newValue) => setIngredients(newValue)}
                renderInput={(params) => <TextField {...params} placeholder="Search ingredients..." />}
                sx={{ padding: 1, cursor: "pointer" }}
                renderTags={(value, getTagProps) => {
                  if (value.length > 1) {
                    return [
                      ...value.slice(0, 1).map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return <Chip key={key} label={option} {...tagProps} />;
                      }),
                      <Chip key="more" label={`+${value.length - 1} more`} color="primary" sx={{ padding: 1, cursor: "pointer" }} />,
                    ];
                  }
                  return value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} label={option} {...tagProps} sx={{ padding: 1, cursor: "pointer" }} />;
                  });
                }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel sx={{ fontWeight: "bold", color: "#333" }}>Avoid Ingredients</FormLabel>
              <Autocomplete
                multiple
                id="avoid-ingredients"
                options={availableIngredients}
                value={avoidIngredients}
                onChange={(event, newValue) => setAvoidIngredients(newValue)}
                renderInput={(params) => <TextField {...params} placeholder="Search ingredients..." />}
                renderTags={(value, getTagProps) => {
                  if (value.length > 1) {
                    return [
                      ...value.slice(0, 1).map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return <Chip key={key} label={option} {...tagProps} />;
                      }),
                      <Chip key="more" label={`+${value.length - 1} more`} color="primary" sx={{ padding: 1, cursor: "pointer" }} />,
                    ];
                  }
                  return value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} label={option} {...tagProps} sx={{ padding: 1, cursor: "pointer" }} />;
                  });
                }}
              />
            </FormControl>
            <Button variant="outlined" color={matchAll ? "primary" : "secondary"} fullWidth onClick={handleMatchAllToggle} sx={{ mt: 2 }}>
              {matchAll ? "Match All Ingredients" : "Match Any Ingredient"}
            </Button>
          </>
        )}

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ fontWeight: "bold", color: "#333" }}>Max Time</FormLabel>
          <TextField
            type="number"
            value={maxTime}
            onChange={handleChange(setMaxTime)}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              },
              htmlInput: {
                min: 1,
              },
            }}
            fullWidth
            sx={{ paddingRight: 1 }}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ fontWeight: "bold", color: "#333" }}>Max Ingredients</FormLabel>
          <TextField
            type="number"
            value={maxIngredients}
            onChange={handleChange(setMaxIngredients)}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">ingredients</InputAdornment>,
              },
              htmlInput: {
                min: 1,
              },
            }}
            fullWidth
            sx={{ paddingRight: 1 }}
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, mb: 1, padding: 1.5 }}>
          Apply Filters
        </Button>
        <Button variant="outlined" color="error" fullWidth onClick={handleResetFilters} sx={{ mt: 1, mb: 1, padding: 1.5 }} startIcon={<ClearAllIcon />}>
          Reset Filters
        </Button>
      </Box>

      <Box sx={{ padding: 2, borderTop: "1px solid #ccc" }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
          Selected Ingredients
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {ingredients.map((ingredient, index) => (
            <Chip key={index} label={ingredient} clickable sx={{ marginTop: 0.5 }} />
          ))}
        </Box>
      </Box>

      <Box sx={{ padding: 2, borderTop: "1px solid #ccc" }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
          Ingredients to Avoid
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {avoidIngredients.map((ingredient, index) => (
            <Chip key={index} label={ingredient} clickable sx={{ marginTop: 0.5 }} />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}

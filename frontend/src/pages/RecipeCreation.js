import React, { useState } from "react";
import { Autocomplete, Container, TextField, Button, Box, Typography, Card, CardContent, CardHeader, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function RecipeCreation() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [ingredientsCount, setIngredientsCount] = useState(0);
  const [mealType, setMealType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
    setIngredientsCount(newIngredients.length);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    setIngredientsCount(ingredients.length);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !imageUrl.trim() ||
      !difficulty ||
      !mealType ||
      prepTime <= 0 ||
      cookTime <= 0 ||
      ingredients.some((ing) => !ing.name.trim() || !ing.quantity.trim() || !ing.unit.trim()) ||
      instructions.some((inst) => !inst.trim())
    ) {
      setSnackbarMessage("Please fill in all fields before submitting.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const recipeData = {
      name,
      description,
      ingredients,
      instructions,
      prep_time: prepTime,
      cook_time: cookTime,
      max_time: prepTime + cookTime,
      difficulty: difficulty.toLowerCase(),
      ingredients_count: ingredients.length,
      meal_type: mealType.toLowerCase(),
      image_url: imageUrl,
    };

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post("http://127.0.0.1:8002/recipes/", recipeData, { headers });
      setSnackbarMessage("Recipe created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating recipe:", error);

      setSnackbarMessage("Error creating recipe. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 700, width: "100%", boxShadow: 3 }}>
        <CardHeader title="Create a New Recipe" sx={{ textAlign: "center", color: "primary.main" }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField label="Recipe Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField label="Image URL" variant="outlined" fullWidth margin="normal" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Ingredients:
            </Typography>
            {ingredients.map((ingredient, index) => (
              <Box key={index} sx={{ display: "flex", gap: "8px", mb: 1 }}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Unit"
                  variant="outlined"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Ingredient"
                  variant="outlined"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  sx={{ flex: 2 }}
                />
              </Box>
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddIngredient}>
              Add Ingredient
            </Button>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Instructions:
            </Typography>
            {instructions.map((instruction, index) => (
              <TextField
                key={index}
                label={`Step ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={instruction}
                onChange={(e) => {
                  const newInstructions = [...instructions];
                  newInstructions[index] = e.target.value;
                  setInstructions(newInstructions);
                }}
              />
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddInstruction}>
              Add Instruction
            </Button>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                label="Prep Time (minutes)"
                variant="outlined"
                type="number"
                fullWidth
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
              />
              <TextField
                label="Cook Time (minutes)"
                variant="outlined"
                type="number"
                fullWidth
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
              <Autocomplete
                options={["Easy", "Medium", "Hard"]}
                value={difficulty}
                onChange={(event, newValue) => setDifficulty(newValue)}
                sx={{ flex: 1 }}
                renderInput={(params) => <TextField {...params} label="Difficulty" variant="outlined" />}
              />
              <Autocomplete
                options={["Breakfast", "Lunch", "Dinner", "Dessert", "Salad"]}
                value={mealType}
                onChange={(event, newValue) => setMealType(newValue)}
                sx={{ flex: 1 }}
                renderInput={(params) => <TextField {...params} label="Meal Type" variant="outlined" />}
              />
            </Box>
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button type="submit" variant="contained">
                Submit Recipe
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default RecipeCreation;

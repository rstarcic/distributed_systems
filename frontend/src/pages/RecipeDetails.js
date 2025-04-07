import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardContent, Typography, List, ListItem, Box, CardMedia } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import prepTime from "../assets/chef-hat.png";
import cookTime from "../assets/cooking-time.png";
import defaultImage from "../assets/default.jpg";
import axios from "axios";
import "../styles/RecipeDetails.css";

const CLASSIC_URL = "http://localhost/classic";

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState([]);

  useEffect(() => {
    async function fetchRecipeDetail() {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${CLASSIC_URL}/recipes/${id}`, { headers });
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    }
    fetchRecipeDetail();
  }, [id]);

  return (
    <Container className="recipe-details-container">
      <Card sx={{ width: "100%", maxWidth: 600, boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ height: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CardMedia
              component="img"
              sx={{
                borderRadius: "8px",
                width: "50%",
                height: "auto",
                objectFit: "contain",
              }}
              image={recipe.image_url || defaultImage}
              alt={recipe.name || "Default Recipe Image"}
            />
          </Box>{" "}
          <Typography variant="h4" textAlign="center" gutterBottom>
            {recipe.name}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={prepTime} alt="Prep Icon" style={{ width: 25, height: 25, marginRight: 8 }} />
              <Typography variant="body1">{recipe.prep_time} min</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={cookTime} alt="Cook Icon" style={{ width: 26, height: 26, marginRight: 8 }} />
              <Typography variant="body1">{recipe.cook_time} min</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SpeedIcon sx={{ mr: 1 }} />
              <Typography variant="body1">{recipe.difficulty}</Typography>
            </Box>
          </Box>
          <Typography variant="h6" textAlign="center" gutterBottom>
            {recipe.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Ingredients:
          </Typography>
          <List>
            {recipe.ingredients &&
              recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} divider>
                  {ingredient.quantity} {ingredient.unit} of {ingredient.name}
                </ListItem>
              ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Instructions:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            <ol>{recipe.instructions && recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}</ol>
          </Typography>
        </CardContent>{" "}
      </Card>
    </Container>
  );
}

export default RecipeDetails;

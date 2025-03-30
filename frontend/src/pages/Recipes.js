import React, { useEffect, useState }  from 'react';
import SearchBar from '../components/SearchBar';
import RecipeList from '../components/RecipeList';
import { Typography } from '@mui/material';
import axios from 'axios';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const response = await axios.get('http://127.0.0.1:8002/recipes', { headers });
        console.log(response.data);
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load recipes');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []); 

  if (error) {
    return <Typography variant="h6" align="center" color="error">{error}</Typography>;
  }

  return (
    <div className="recipes-container">
      <SearchBar></SearchBar>
      <RecipeList recipes={recipes} loading={loading}></RecipeList>
    </div>
  );
};

export default Recipes;

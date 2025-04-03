import React from "react";
import { Box, Grid2, Card, CardMedia, CardHeader, CardContent, Button, Typography, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RecipeList({ recipes, loading }) {
  const navigate = useNavigate();
  console.log(recipes.length);
  return (
    <Box sx={{ flexGrow: 1, p: 2, ml: { xs: 0, md: 35 } }}>
      <Grid2 container spacing={8} justifyContent="center" alignItems="center">
        {loading
          ? [...Array(10)].map((_, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ width: 340, height: "45vh" }}>
                  <Skeleton variant="rectangular" width="100%" height="60%" />
                  <CardHeader title={<Skeleton width="80%" />} subheader={<Skeleton width="60%" />} />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      <Skeleton width="100%" height={40} />
                    </Typography>
                  </CardContent>
                  <Skeleton variant="rectangular" width="100%" height={36} />
                </Card>
              </Grid2>
            ))
          : recipes.map((recipe, index) => (
              <Grid2
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: recipes.length === 1 ? "center" : "flex-start",
                }}
              >
                <Card sx={{ maxWidth: "14vw", height: "45vh" }}>
                  <CardMedia component="img" image={recipe.image_url} alt="Recipe Image" sx={{ width: "100%", height: "60%" }} />
                  <CardHeader title={recipe.name} subheader="Quick and easy" />
                  <CardContent sx={{ flexGrow: 1, maxHeight: "30vh", overflow: "hidden" }}>
                    <Typography variant="body2" color="textSecondary">
                      {recipe.description}
                    </Typography>
                  </CardContent>
                  <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/recipes/${recipes[index].recipe_id}`)}>
                    See Details
                  </Button>
                </Card>
              </Grid2>
            ))}
      </Grid2>
    </Box>
  );
}

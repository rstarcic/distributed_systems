import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { InputAdornment, Box } from "@mui/material";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20vh" }}>
      <TextField
        sx={{ width: "15vw" }}
        value={searchText}
        onChange={handleSearchChange}
        label="Search"
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}

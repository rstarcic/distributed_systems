import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: "#FFAA33", 
      contrastText: "#ffffff"
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#f28c28',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '8px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FAF9F6',
          borderRadius: '3px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
         
        },
      },
    },
  }
});

export default theme;

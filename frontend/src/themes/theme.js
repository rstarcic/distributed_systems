import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: "#FFAA33", 
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#9E9FA5",
      contrastText: "#ffffff"
    }
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
     MuiDrawer: {
      styleOverrides: {
        root: {
          width: 320,
          flexShrink: 0,
        },
        paper: {
          width: 320,
          boxSizing: "border-box",
          padding: 2,
        },
      },
    },
  }
});

export default theme;

import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#FFAA33",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9E9FA5",
      contrastText: "#ffffff",
    },
  },
  typography: {
    h4: {
      fontSize: "2rem",
      fontWeight: 600,
      textAlign: "center",
      marginBottom: "16px",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
      marginTop: "16px",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 500,
      marginTop: "5px",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#f28c28",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderRadius: "8px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FAF9F6",
          borderRadius: "3px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
    MuiSnackbar: {
      styleOverrides: {
        root: {
          left: "50% !important",
          transform: "translateX(-50%) !important",
          minWidth: "400px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
          padding: "16px 24px",
          textAlign: "center",
          alignItems: "center",
        },
      },
    },
  },
});

export default theme;

import { useState } from "react";
import ChatBox from "./components/ChatBox";
import Messages from "./components/Messages";
import SideBar from "./components/SideBar";
import {
  Box,
  createTheme,
  CssBaseline,
  Drawer,
  IconButton,
  styled,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const drawerWidth = 260;

// Create a dark theme with ChatGPT-like colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10a37f", // ChatGPT's green
    },
    background: {
      default: "#202123", // Dark sidebar
      paper: "#343541", // Main chat area
    },
    text: {
      primary: "#ffffff",
      secondary: "#acacbe",
    },
  },
  typography: {
    fontFamily:
      '"Söhne", "Söhne Buch", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
        },
      },
    },
  },
});

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})<{
  open?: boolean;
  isMobile?: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    !isMobile && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const App = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "background.default",
              borderRight: "none",
            },
          }}
        >
          <SideBar />
        </Drawer>

        <Main open={drawerOpen} isMobile={isMobile}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={toggleDrawer}
                edge="start"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Messages />
          </Box>

          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <ChatBox />
          </Box>
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default App;

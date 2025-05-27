import { Box, useTheme } from "@mui/material";
import RecentConversations from "./RecentConversations";
import Header from "./Header";
import Footer from "./Footer";

const Sidebar = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "280px",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Header />
      <RecentConversations />
      <Footer />
    </Box>
  );
};

export default Sidebar;

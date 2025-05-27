import { Box, useTheme } from "@mui/material";
import Credits from "./Credits";
import AuthButtons from "./AuthButtons";
import UserInfo from "./UserInfo";

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "rgba(255, 255, 255, 0.02)",
      }}
    >
      <UserInfo />
      <AuthButtons />
      <Credits />
    </Box>
  );
};

export default Footer;

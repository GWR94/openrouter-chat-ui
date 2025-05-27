import { Box, Button, useTheme } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAppDispatch as useDispatch } from "../../hooks/redux";
import { setConversation } from "../../features/chat.slice";

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleNewChat = () => dispatch(setConversation(null));

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: "rgba(255, 255, 255, 0.02)", // Subtle highlight
      }}
    >
      <Button
        sx={{
          borderColor: theme.palette.divider,
          justifyContent: "flex-start",
          width: "100%",
          borderRadius: 2,
          padding: theme.spacing(1.5, 2),
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }}
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleNewChat}
      >
        New chat
      </Button>
    </Box>
  );
};

export default Header;

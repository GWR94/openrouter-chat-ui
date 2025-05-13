import { Box, CircularProgress, Avatar, useTheme } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

const LoadingMessage = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: 52,
        padding: theme.spacing(3, 2),
        display: "flex",
        borderBottom: "1px solid",
        alignItems: "center",
        borderColor: theme.palette.divider,
        "&:last-of-type": {
          borderBottom: "none",
        },
      }}
    >
      <Box sx={{ mr: theme.spacing(3) }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <SmartToyOutlinedIcon />
        </Avatar>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress size={24} />
      </Box>
    </Box>
  );
};

export default LoadingMessage;

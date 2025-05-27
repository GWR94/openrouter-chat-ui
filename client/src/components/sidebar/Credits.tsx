import { MoneyOutlined as MoneyOutlinedIcon } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { useAppSelector as useSelector } from "../../hooks/redux";

const Credits = () => {
  const { total, used, isLoading } = useSelector((state) => state.credits);
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: theme.spacing(1.5, 2),
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <MoneyOutlinedIcon fontSize="small" />
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          $ {!total || !used ? 0 : (total - used).toFixed(4)}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            color: theme.palette.text.secondary,
          }}
        >
          Paid Models Disabled
        </Typography>
      </Box>
    </Box>
  );
};

export default Credits;

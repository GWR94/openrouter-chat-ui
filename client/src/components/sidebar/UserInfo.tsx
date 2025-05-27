import { Box, Typography } from "@mui/material";
import { useAppSelector as useSelector } from "../../hooks/redux";

const UserInfo = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const displayName = user?.displayName || user?.email;
  return (
    user && (
      <Box>
        <Typography>
          Logged in as{" "}
          <Typography
            component="span"
            fontWeight="medium"
            fontStyle="italic"
            sx={{
              color: "primary.main",
              textAlign: "center",
              fontSize: "1rem",
            }}
          >
            {displayName}
          </Typography>
        </Typography>
      </Box>
    )
  );
};

export default UserInfo;

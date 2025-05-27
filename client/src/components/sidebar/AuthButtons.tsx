import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../../hooks/redux";
import {
  Box,
  IconButton,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
import { logoutUser } from "../../features/auth.slice";
import { useState } from "react";
import LoginDialog from "../LoginDialog";
import { loginOAuthUser } from "../../services/auth.service";

const AuthButtons = () => {
  type OAuthProviders = "google" | "github" | "facebook";
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState<OAuthProviders | null>(null);

  const handleLoginOAuth = (provider: OAuthProviders) => {
    setLoadingIcon(provider);
    loginOAuthUser(provider);
  };

  return (
    <>
      <Button
        variant={user ? "outlined" : "contained"}
        color="secondary"
        onClick={() => (user ? dispatch(logoutUser()) : setDialogOpen(true))}
        sx={{
          borderRadius: 2,
          py: 1,
          fontWeight: 500,
          width: "100%",
        }}
      >
        {user ? "Sign out" : "Sign in"}
      </Button>
      {!user && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <IconButton
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              width: 40,
              height: 40,
            }}
            onClick={() => handleLoginOAuth("github")}
          >
            {loadingIcon === "github" ? (
              <CircularProgress size={20} />
            ) : (
              <GitHubIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              width: 40,
              height: 40,
            }}
            onClick={() => handleLoginOAuth("google")}
          >
            {loadingIcon === "google" ? (
              <CircularProgress size={20} />
            ) : (
              <GoogleIcon fontSize="small" />
            )}{" "}
          </IconButton>
          <IconButton
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              width: 40,
              height: 40,
            }}
            onClick={() => handleLoginOAuth("facebook")}
          >
            {loadingIcon === "facebook" ? (
              <CircularProgress size={20} />
            ) : (
              <FacebookIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      )}
      <LoginDialog isOpen={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
};

export default AuthButtons;

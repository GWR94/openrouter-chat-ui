import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  useTheme,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { loginUser } from "../features/auth.slice";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../hooks/redux";
import { Facebook, GitHub, Google } from "@mui/icons-material";
import { RootState } from "../store";
import { loginOAuthUser } from "../services/auth.service";

type LoginDialogProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, setOpen }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
            minWidth: 300,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Please enter your login credentials.
          </Typography>
          <TextField
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            size="small"
            label="Username"
            fullWidth
          />
          <TextField
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            label="Password"
            size="small"
            fullWidth
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography>Login with Socials</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
              }}
            >
              <IconButton
                sx={{ color: theme.palette.secondary.main }}
                onClick={() => loginOAuthUser("google")}
              >
                <Google />
              </IconButton>
              <IconButton
                sx={{ color: theme.palette.secondary.main }}
                onClick={() => loginOAuthUser("facebook")}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ color: theme.palette.secondary.main }}
                onClick={() => loginOAuthUser("github")}
              >
                <GitHub />
              </IconButton>
            </Box>
          </Box>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              loading={isLoading}
              onClick={() => dispatch(loginUser(credentials))}
            >
              Login
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;

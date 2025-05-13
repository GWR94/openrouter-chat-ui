import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MoneyOutlinedIcon from "@mui/icons-material/MoneyOutlined";
import { RootState } from "../store";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../hooks/redux";
import {
  deleteConversation,
  setConversation,
} from "../features/conversations.slice";
import { useEffect, useState } from "react";
import { checkCredits, logoutUser, loginUser } from "../features/auth.slice";
import LoginDialog from "./LoginDialog";

const Sidebar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { conversations, currentId, credits } = useSelector(
    (state: RootState) => state.conversations
  );
  const { user, isLoading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(checkCredits());
  }, [dispatch]);

  const handleNewChat = () => dispatch(setConversation(null));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            padding: theme.spacing(2),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{
              borderColor: theme.palette.divider,
              justifyContent: "flex-start",
              textAlign: "left",
              width: "100%",
              borderRadius: 4,
              padding: theme.spacing(1, 2),
            }}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleNewChat}
          >
            New chat
          </Button>
        </Box>
        <Box sx={{ px: 2, mt: 2, mb: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Recent conversations
          </Typography>
        </Box>

        <List sx={{ px: 1, flexGrow: 1, overflowY: "auto" }}>
          {conversations.map((convo) => (
            <ListItem
              key={convo.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => dispatch(deleteConversation(convo.id))}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                selected={currentId === convo.id}
                onClick={() => dispatch(setConversation(convo.id))}
                sx={{
                  borderRadius: 4,
                  marginBottom: theme.spacing(0.5),
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={convo.title}
                  slotProps={{
                    primary: {
                      noWrap: true,
                      fontSize: 14,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            padding: theme.spacing(2),
            borderTop: `1px solid ${theme.palette.divider}`,
            height: "140px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ListItemButton
            sx={{
              borderRadius: 4,
              marginBottom: theme.spacing(0.5),
              "&.Mui-selected": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() =>
              user ? dispatch(logoutUser()) : setDialogOpen(true)
            }
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={user ? "Logout" : "Login"}
              slotProps={{
                primary: {
                  fontSize: 14,
                },
              }}
            />
          </ListItemButton>
          <ListItemButton
            sx={{
              borderRadius: 4,
              marginBottom: theme.spacing(0.5),
              "&.Mui-selected": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <MoneyOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontSize: "14px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "inline-flex",
                }}
              >
                $ {!credits ? 0 : (credits.total - credits.used).toFixed(4)}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: theme.palette.text.disabled,
                    ml: 1,
                    alignSelf: "center",
                  }}
                >
                  Paid Models Disabled
                </Typography>
              </Typography>
            </ListItemText>
          </ListItemButton>
        </Box>
      </Box>
      <LoginDialog isOpen={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
};

export default Sidebar;

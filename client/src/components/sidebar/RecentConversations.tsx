import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
} from "@mui/icons-material";
import { deleteConversation, setConversation } from "../../features/chat.slice";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "../../hooks/redux";

const RecentConversations = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { conversations, currentId } = useSelector((state) => state.chat);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" color="text.secondary">
          Recent conversations
        </Typography>
      </Box>

      <List
        sx={{
          px: 1,
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
          },
        }}
      >
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
    </Box>
  );
};

export default RecentConversations;

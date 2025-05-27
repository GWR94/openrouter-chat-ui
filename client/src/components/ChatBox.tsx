import { useState } from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../hooks/redux";
import {
  createConversation,
  getChatResponse,
  Message,
} from "../features/chat.slice";
import { RootState } from "../store";
import {
  Box,
  IconButton,
  InputBase,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  Paper,
  Divider,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FreeModel, PaidModel } from "../../data/models";
import { setModel } from "../features/models.slice";
import { PromptManager } from "./prompt/PromptManager";

const ChatBox: React.FC = () => {
  type Model = FreeModel | PaidModel;
  const theme = useTheme();
  const [input, setInput] = useState<string>("");

  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const { items: models, current } = useSelector((state) => state.models);
  const dispatch = useDispatch();

  const { isLoading, currentId } = useSelector(
    (state: RootState) => state.chat
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const openModelMenu = (event: React.MouseEvent<HTMLElement>) => {
    setModelMenuAnchor(event.currentTarget);
  };

  const handleModelChange = (model: Model) => {
    dispatch(setModel(model));
    setModelMenuAnchor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message: Message = {
      content: input.trim(),
      role: "user",
    };
    setInput("");

    if (!currentId) {
      dispatch(
        createConversation({
          content: message.content,
          model: current.model,
        })
      );
      return;
    }

    try {
      dispatch(
        getChatResponse({
          message,
          model: current.model,
        })
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", p: 2, maxWidth: 768, mx: "auto", height: "140px" }}
    >
      <Tooltip title="Select model">
        <Box
          onClick={openModelMenu}
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: 12,
            mb: 1,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          Model: {current.name} ({current.cost})
          <ExpandMoreIcon sx={{ ml: 1 }} />
        </Box>
      </Tooltip>
      <Paper
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(1, 2),
          borderRadius: 8,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
          boxShadow: "none",
        }}
      >
        <InputBase
          fullWidth
          multiline
          maxRows={5}
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <PromptManager />

        <Tooltip title="Send message">
          <IconButton
            color="primary"
            type="submit"
            disabled={!input.trim() || isLoading}
            size="small"
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {current.cost === "Free" && (
        <Box
          sx={{
            textAlign: "center",
            mt: 1,
            color: theme.palette.warning.main,
            fontSize: 12,
          }}
        >
          Warning - Free models will take longer and can possibly fail.
        </Box>
      )}
      {(current.cost === "$$$$" || current.cost === "$$$") && (
        <Box
          sx={{
            mt: 1,
            textAlign: "center",
            color: theme.palette.warning.main,
            fontSize: 12,
          }}
        >
          Warning - This model is{" "}
          {current.cost === "$$$$" ? "very " : "reasonably "}
          expensive.
        </Box>
      )}

      <Menu
        anchorEl={modelMenuAnchor}
        open={Boolean(modelMenuAnchor)}
        onClose={() => setModelMenuAnchor(null)}
      >
        <MenuItem disabled>Free Models</MenuItem>
        {models
          .filter((model) => model.cost === "Free")
          .map((m: Model) => (
            <MenuItem
              key={m.model}
              selected={m.model === m.model}
              onClick={() => handleModelChange(m)}
            >
              {m.name}
            </MenuItem>
          ))}
        <Divider />
        <MenuItem disabled>
          <Box>Paid Models</Box>
        </MenuItem>
        {(models.filter((model: Model) => model.cost !== "Free") as PaidModel[])
          .sort((a: PaidModel, b: PaidModel) =>
            a.average > b.average ? -1 : 1
          )
          .map((m) => (
            <MenuItem
              key={m.model}
              selected={m.model === current.model}
              onClick={() => handleModelChange(m)}
              sx={{
                display: "flex",
                w: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>{m.name}</Box>
              <Box sx={{ ml: 1 }}>({m.cost})</Box>
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default ChatBox;

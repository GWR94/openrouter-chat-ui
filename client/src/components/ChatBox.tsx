import { useState } from "react";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../hooks/redux";
import { sendMessage } from "../features/conversations.slice";
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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { models, freeModels, FreeModel, PaidModel } from "../../data/models";

const ChatBox: React.FC = () => {
  type Model = FreeModel | PaidModel;
  const theme = useTheme();
  const [input, setInput] = useState<string>("");
  const [currentModel, setCurrentModel] = useState<Model>(freeModels[0]);
  const [modelMenuAnchor, setModelMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state: RootState) => state.conversations);

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
    console.log(model);
    setCurrentModel(model);
    setModelMenuAnchor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = input.trim();
    setInput("");

    // Dispatch the sendMessage thunk action
    try {
      dispatch(
        sendMessage({
          message,
          model: currentModel.model,
        })
      ).unwrap();
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
      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: 12,
          mb: 1,
        }}
      >
        Model: {currentModel?.name}
      </Box>
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

        <Tooltip title="Select model">
          <IconButton size="small" onClick={openModelMenu} sx={{ mr: 1 }}>
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>

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
      {currentModel.cost === "Free" && (
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
      {(currentModel.cost === "$$$$" || currentModel.cost === "$$$") && (
        <Box
          sx={{
            mt: 1,
            textAlign: "center",
            color: theme.palette.warning.main,
            fontSize: 12,
          }}
        >
          Warning - This model is {currentModel.cost === "$$$$" ? "very " : " "}
          expensive.
        </Box>
      )}

      <Menu
        anchorEl={modelMenuAnchor}
        open={Boolean(modelMenuAnchor)}
        onClose={() => setModelMenuAnchor(null)}
      >
        <MenuItem disabled>Free Models</MenuItem>
        {freeModels.map((modelOption) => (
          <MenuItem
            key={modelOption.model}
            selected={modelOption.model === currentModel.model}
            onClick={() => handleModelChange(modelOption)}
          >
            {modelOption.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem disabled>
          <Box>Paid Models</Box>
        </MenuItem>
        {models
          .sort((a: PaidModel, b: PaidModel) =>
            a.average > b.average ? -1 : 1
          )
          .map((modelOption) => (
            <MenuItem
              key={modelOption.model}
              selected={modelOption.model === currentModel.model}
              onClick={() => handleModelChange(modelOption)}
              sx={{
                display: "flex",
                w: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box>{modelOption.name}</Box>
              <Box sx={{ ml: 1 }}>({modelOption.cost})</Box>
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default ChatBox;

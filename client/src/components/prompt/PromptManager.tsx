import { useState, useEffect } from "react";
import { Dialog, IconButton, Tooltip, Badge } from "@mui/material";
import { MessageOutlined as MessageIcon } from "@mui/icons-material";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../../hooks/redux";
import { getPrompts, Prompt } from "../../features/prompts.slice";
import PromptListView from "./PromptListView";
import CreateEditPrompt from "./CreateEditPrompt";

export const PromptManager = () => {
  const dispatch = useDispatch();
  const { active } = useSelector((state) => state.prompts);
  const [open, setOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getPrompts());
  }, [dispatch]);

  const handleClose = () => {
    setOpen(false);
    setEditingPrompt(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setIsEditing(true);
    setEditingPrompt(prompt);
    setOpen(true);
  };

  /**
   * TODO
   * [ ] checkmark when prompt is active
   * [ ] make active prompts be in all requests
   */

  return (
    <>
      <Tooltip title="Manage prompts">
        <Badge
          color="primary"
          badgeContent={active.length}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.6rem",
              height: "16px",
              minWidth: "16px",
              padding: "0 4px",
            },
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setOpen(true);
              setIsEditing(false);
            }}
            sx={{ mr: 1 }}
          >
            <MessageIcon />
          </IconButton>
        </Badge>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {!isEditing ? (
          <PromptListView
            handleEdit={handleEdit}
            handleClose={handleClose}
            setIsEditing={setIsEditing}
          />
        ) : (
          <CreateEditPrompt
            setIsEditing={setIsEditing}
            editingPrompt={editingPrompt}
            handleClose={handleClose}
          />
        )}
      </Dialog>
    </>
  );
};

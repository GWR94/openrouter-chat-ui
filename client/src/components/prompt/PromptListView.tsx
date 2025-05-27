import {
  DialogTitle,
  IconButton,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  DialogActions,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckOutlined as CheckOutlinedIcon,
} from "@mui/icons-material";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../../hooks/redux";
import {
  deletePrompt,
  Prompt,
  setPromptActive,
} from "../../features/prompts.slice";

type PromptListViewProps = {
  setIsEditing: (isEditing: boolean) => void;
  handleClose: () => void;
  handleEdit: (prompt: Prompt) => void;
};

const PromptListView = ({
  setIsEditing,
  handleClose,
  handleEdit,
}: PromptListViewProps) => {
  const {
    items: prompts,
    isLoading,
    active,
  } = useSelector((state) => state.prompts);
  const dispatch = useDispatch();

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Saved Prompts
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {isLoading ? (
            <ListItem>
              <ListItemText primary="Loading prompts..." />
            </ListItem>
          ) : prompts.length === 0 ? (
            <ListItem>
              <ListItemText primary="No prompts yet. Create one to get started!" />
            </ListItem>
          ) : (
            prompts.map((prompt) => {
              const isActive =
                prompt.id && active.some((p) => p.id === prompt.id);
              return (
                <ListItem
                  key={prompt.id}
                  secondaryAction={
                    <Box>
                      <Tooltip
                        title={`${
                          !isActive ? "Set " : "Unset "
                        } as active prompt`}
                      >
                        <IconButton
                          onClick={() => dispatch(setPromptActive(prompt))}
                        >
                          <CheckOutlinedIcon
                            sx={{
                              color: isActive
                                ? "primary.main"
                                : "text.secondary",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit prompt">
                        <IconButton onClick={() => handleEdit(prompt)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete prompt">
                        <IconButton
                          onClick={() =>
                            prompt.id && dispatch(deletePrompt(prompt.id))
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={prompt.name}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {prompt.description || "No description"}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Fab
          color="primary"
          size="medium"
          onClick={() => setIsEditing(true)}
          sx={{ position: "absolute", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      </DialogActions>
    </>
  );
};

export default PromptListView;

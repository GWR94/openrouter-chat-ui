import { ExpandMore } from "@mui/icons-material";
import {
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { models } from "../../../data/models";
import {
  createPrompt,
  Prompt,
  updatePrompt,
  deletePrompt,
} from "../../features/prompts.slice";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector,
} from "../../hooks/redux";

type CreateEditPromptProps = {
  setIsEditing: (isEditing: boolean) => void;
  editingPrompt: Prompt | null;
  handleClose: () => void;
};

const initialPrompt = {
  name: "",
  description: "",
  content: "",
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 1024,
  isSystem: false,
};

const CreateEditPrompt = ({
  setIsEditing,
  editingPrompt,
  handleClose,
}: CreateEditPromptProps) => {
  const [prompt, editPrompt] = useState<Omit<Prompt, "id">>(
    editingPrompt || initialPrompt
  );
  const {
    name,
    content,
    description,
    model,
    temperature,
    maxTokens,
    isSystem,
  } = prompt;

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptData = {
      name,
      description,
      content,
      model,
      temperature,
      maxTokens,
      isSystem,
    };

    if (editingPrompt) {
      await dispatch(
        updatePrompt({
          id: editingPrompt.id,
          ...promptData,
        })
      );
    } else {
      await dispatch(createPrompt(promptData));
    }
    handleClose();
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={() => setIsEditing(false)}
          size="small"
          edge="start"
        >
          <ArrowBackIcon />
        </IconButton>
        {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => editPrompt({ ...prompt, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => editPrompt({ ...prompt, content: e.target.value })}
            margin="normal"
            required
            multiline
            minRows={4}
            maxRows={12}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={description}
            onChange={(e) =>
              editPrompt({ ...prompt, description: e.target.value })
            }
          />
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="optional-settings-content"
              id="optional-settings-header"
            >
              <Typography>Optional Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Model</InputLabel>
                  <Select
                    value={model}
                    onChange={(e) =>
                      editPrompt({ ...prompt, model: e.target.value })
                    }
                  >
                    {models.map((model) => (
                      <MenuItem key={model.name} value={model.name}>
                        {model.name} [{model.cost}]
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography gutterBottom>
                    Temperature: {temperature}
                  </Typography>
                  <Slider
                    value={temperature}
                    onChange={(_, value) =>
                      editPrompt({ ...prompt, temperature: value as number })
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <Typography gutterBottom>Max Tokens: {maxTokens}</Typography>
                  <Slider
                    value={maxTokens}
                    onChange={(_, value) =>
                      editPrompt({ ...prompt, maxTokens: value as number })
                    }
                    min={256}
                    max={4096}
                    step={256}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={isSystem}
                      onChange={(e) =>
                        editPrompt({ ...prompt, isSystem: e.target.checked })
                      }
                    />
                  }
                  label="System Prompt"
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingPrompt ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};

export default CreateEditPrompt;

import { Box, Avatar, useTheme } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { MessageRole } from "../features/chat.slice";
import "highlight.js/styles/github-dark.css"; // Add this import

export type MessageProps = {
  content: string;
  role: MessageRole;
};

const Message = ({ content, role }: MessageProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor:
          role === "assistant"
            ? theme.palette.background.paper
            : theme.palette.grey[900],
        padding: theme.spacing(2),
        display: "flex",
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: "flex-start",
        "&:last-of-type": {
          borderBottom: "none",
        },
      }}
    >
      <Box sx={{ pt: theme.spacing(1) }}>
        <Avatar
          sx={{ bgcolor: role === "assistant" ? "primary.main" : "grey.700" }}
        >
          {role === "assistant" ? (
            <SmartToyOutlinedIcon />
          ) : (
            <PersonOutlineOutlinedIcon />
          )}
        </Avatar>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "calc(100% - 56px)",
          ml: theme.spacing(3),
          "& pre": {
            backgroundColor: theme.palette.grey[900],
            borderRadius: 1,
            padding: 2,
            overflow: "auto",
          },
          "& code": {
            fontFamily: "Fira Code, monospace",
            fontSize: "0.875rem",
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true }]]}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default Message;

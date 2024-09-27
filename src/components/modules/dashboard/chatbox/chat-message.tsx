import type { FC } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ChatMessageProps {
  authorAvatar?: string | null;
  authorName: string;
  body: string;
  contentType: string;
  createdAt: string;
  position?: "left" | "right";
  isGroup: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = (props) => {
  const {
    authorAvatar,
    authorName,
    body,
    contentType,
    createdAt,
    position,
    isGroup,
    ...other
  } = props;

  const ago = formatDistanceToNowStrict(new Date(createdAt));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: position === "right" ? "flex-end" : "flex-start",
      }}
      {...other}
    >
      <Stack
        alignItems="flex-start"
        direction={position === "right" ? "row-reverse" : "row"}
        spacing={1}
        sx={{
          maxWidth: 500,
          ml: position === "right" ? "auto" : 0,
          mr: position === "left" ? "auto" : 0,
        }}
      >
        <Avatar
          src={authorAvatar || undefined}
          sx={{
            height: 32,
            width: 32,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Card
            sx={{
              backgroundColor:
                position === "right" ? "primary.main" : "background.paper",
              color: position === "right" ? "white" : "text.primary",
              borderRadius: 1,
              px: 1,
              py: 1,
            }}
          >
            {position === "left" && isGroup && (
              <Box sx={{ mb: 1 }}>
                <Link
                  color="inherit"
                  sx={{ cursor: "pointer" }}
                  variant="subtitle2"
                >
                  {authorName}
                </Link>
              </Box>
            )}
            {contentType === "image" && (
              <CardMedia
                onClick={(): void => {}}
                image={body}
                sx={{
                  height: 200,
                  width: 200,
                }}
              />
            )}
            {contentType === "text" && (
              <Typography color="inherit" variant="body2">
                {body}
              </Typography>
            )}
          </Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: position === "right" ? "flex-end" : "flex-start",
              mt: 1,
              px: 2,
            }}
          >
            <Typography color="text.secondary" noWrap variant="caption">
              {ago} ago
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

ChatMessage.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["left", "right"]),
};

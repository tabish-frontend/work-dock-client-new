import {
  Avatar,
  AvatarGroup,
  Box,
  Link,
  Popover,
  Stack,
  Tooltip,
} from "@mui/material";
import { Employee } from "src/types";
import { ImageAvatar } from "./image-avatar";
import { RouterLink } from "./router-link";
import { paths } from "src/constants/paths";
import { useState } from "react";

export const UserAvatarGroup = ({ users }: { users: Employee[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverToggle = (
    event: React.MouseEvent<HTMLElement>,
    open: boolean
  ) => {
    setAnchorEl(open ? event.currentTarget : null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "user-popover" : undefined;

  const renderUserAvatars = users.slice(0, 2).map((user) => (
    <Tooltip key={user._id} title={user.full_name}>
      <Link component={RouterLink} href={`${paths.employees}/${user.username}`}>
        <ImageAvatar
          path={user.avatar || ""}
          alt={user.username}
          width={40}
          height={40}
        />
      </Link>
    </Tooltip>
  ));

  const remainingUsers = users.length > 2 && (
    <Avatar
      onClick={(event) => handlePopoverToggle(event, true)}
      style={{ cursor: "pointer" }}
    >
      +{users.length - 2}
    </Avatar>
  );

  const popoverContent = (
    <Box p={1}>
      {users.slice(2).map((user) => (
        <Stack
          key={user._id}
          direction="row"
          alignItems="center"
          gap={2}
          p={0.5}
        >
          <Avatar src={user.avatar || ""} alt={user.full_name} />
          <Link
            color="inherit"
            component={RouterLink}
            href={`${paths.employees}/${user.username}`}
            variant="subtitle1"
          >
            {user.full_name}
          </Link>
        </Stack>
      ))}
    </Box>
  );

  return (
    <>
      <AvatarGroup style={{ justifyContent: "center" }}>
        {renderUserAvatars}
        {remainingUsers}
      </AvatarGroup>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={(event: any) => handlePopoverToggle(event, false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {popoverContent}
      </Popover>
    </>
  );
};

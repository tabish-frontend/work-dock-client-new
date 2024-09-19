import {
  Box,
  Card,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SquareEditOutline, TrashCanOutline } from "mdi-material-ui";
import { useRouter } from "next/router";
import { paths } from "src/constants/paths";
import { UserAvatarGroup } from "src/components/shared";
import { format } from "date-fns";
import { formatDate } from "src/utils";

export const WorkspaceCard = ({
  workspace,
  handleUpdateWorkspace,
  handleDeleteWorkspace,
  isAccess,
}: {
  workspace: any;
  handleUpdateWorkspace: () => void;
  handleDeleteWorkspace: () => void;
  isAccess: boolean;
}) => {
  const router = useRouter();

  return (
    <Card
      sx={{ cursor: "pointer", padding: 3 }}
      onClick={() => router.push(`${paths.workspaces}/${workspace?.slug}`)}
    >
      {/* Workspace Name and Metadata */}
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          {workspace.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created on: {formatDate(workspace.createdAt)}
        </Typography>
      </Box>

      {/* Members Avatars */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <UserAvatarGroup users={workspace.members} />
        {isAccess && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit Workspace">
              <IconButton
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateWorkspace();
                }}
              >
                <SquareEditOutline />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Workspace">
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWorkspace();
                }}
              >
                <TrashCanOutline />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>

      {/* Divider Line */}
      <Divider sx={{ marginY: 2 }} />

      {/* Footer with more details */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Owner: {workspace.owner.full_name}
        </Typography>
      </Stack>
    </Card>
  );
};
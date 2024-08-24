import type { ChangeEvent, FC, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import ArchiveIcon from "@untitled-ui/icons-react/build/esm/Archive";
import EyeIcon from "@untitled-ui/icons-react/build/esm/Eye";
import EyeOffIcon from "@untitled-ui/icons-react/build/esm/EyeOff";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles/createTheme";

import { useMockedUser } from "src/hooks/use-mocked-user";
import type { RootState } from "src/store";
import { useDispatch, useSelector } from "src/store";
import { thunks } from "src/thunks/kanban";
import type { Column, Member, Task } from "src/types/kanban";

import { TaskChecklist } from "./task-checklist";
import { TaskComment } from "./task-comment";
import { TaskCommentAdd } from "./task-comment-add";
import { TaskLabels } from "./task-labels";
import { TaskStatus } from "./task-status";
import {
  Employee,
  WorkSpaceBoardColumn,
  WorkSpaceBoardColumnTasks,
} from "src/types";
import { useWorkSpace } from "src/hooks/use-workSpace";
import { SelectMultipleUsers } from "src/components/shared";
import { useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers";
import { PictureAsPdf, Description } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Close } from "mdi-material-ui";

interface Attachment {
  name: string;
  id: number;
  type: string;
  url: string;
}

export interface TaskModalValues {
  members: Employee[];
  attachments: Attachment[];
  dueDate: Date;
  labels: string[];
  description: string;
}

export const taskModalInitialValues: TaskModalValues = {
  members: [],
  attachments: [],
  dueDate: new Date(),
  labels: [],
  description: "",
};

const useColumns = (): Column[] => {
  return useSelector((state) => {
    const { columns } = state.kanban;

    return Object.values(columns.byId);
  });
};

const useTask = (taskId?: string): Task | null => {
  return useSelector((state: RootState) => {
    const { tasks } = state.kanban;

    if (!taskId) {
      return null;
    }

    return tasks.byId[taskId] || null;
  });
};

const useColumn = (columnId?: string): Column | null => {
  return useSelector((state) => {
    const { columns } = state.kanban;

    if (!columnId) {
      return null;
    }

    return columns.byId[columnId] || null;
  });
};

const useAuthor = (authorId?: string): Member | null => {
  return useSelector((state: RootState) => {
    const { members } = state.kanban;

    if (!authorId) {
      return null;
    }

    return members.byId[authorId] || null;
  });
};

const useAssignees = (assigneesIds?: string[]): Member[] => {
  return useSelector((state: RootState) => {
    const { members } = state.kanban;

    if (!assigneesIds) {
      return [];
    }

    return assigneesIds
      .map((assigneeId: string) => members.byId[assigneeId])
      .filter((assignee) => !!assignee);
  });
};

interface TaskModalProps {
  onClose?: () => void;
  open?: boolean;
  task?: WorkSpaceBoardColumnTasks;
  boardColumns?: WorkSpaceBoardColumn[];
  boardMembers?: any;
}

export const TaskModal: FC<TaskModalProps> = (props) => {
  const {
    task,
    boardColumns,
    boardMembers,
    onClose,
    open = false,
    ...other
  } = props;

  const { handleDeleteTask, handleMoveTask } = useWorkSpace();

  const user = useMockedUser();
  const dispatch = useDispatch();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [nameCopy, setNameCopy] = useState<string>(task?.title || "");
  const debounceMs = 500;

  const formik = useFormik({
    initialValues: taskModalInitialValues,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      // helpers.setStatus({ success: true });
      // helpers.setSubmitting(false);
      // const updatingValues = {
      //   _id: values._id,
      //   ...getChangedFields<WorkSpaceBoard>(values, formik.initialValues),
      // };
      // onConfirm(updatingValues);
      // onCancel();

      console.log("Formik values", values);
      setIsFormBeingChanged(false);
    },
  });

  const handleTabsReset = useCallback(() => {
    setCurrentTab("overview");
  }, []);

  useEffect(
    () => {
      handleTabsReset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [task?._id]
  );

  const handleNameReset = useCallback(() => {
    setNameCopy(task?.title || "");
  }, [task]);

  useEffect(
    () => {
      handleNameReset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [task]
  );

  const handleTabsChange = useCallback(
    (event: ChangeEvent<any>, value: string): void => {
      setCurrentTab(value);
    },
    []
  );

  const handleNameUpdate = useCallback(
    async (name: string) => {
      try {
        await dispatch(
          thunks.updateTask({
            taskId: task!._id,
            update: {
              name,
            },
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleNameBlur = useCallback(() => {
    if (!nameCopy) {
      setNameCopy(task!.title);
      return;
    }

    if (nameCopy === task!.title) {
      return;
    }

    handleNameUpdate(nameCopy);
  }, [task, nameCopy, handleNameUpdate]);

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setNameCopy(event.target.value);
    },
    []
  );

  const handleNameKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      if (event.code === "Enter") {
        if (nameCopy && nameCopy !== task!.title) {
          handleNameUpdate(nameCopy);
        }
      }
    },
    [task, nameCopy, handleNameUpdate]
  );

  const handleDescriptionUpdate = useMemo(
    () =>
      debounce(async (description: string) => {
        try {
          await dispatch(
            thunks.updateTask({
              taskId: task!._id,
              update: {
                description,
              },
            })
          );
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong!");
        }
      }, debounceMs),
    [dispatch, task]
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      handleDescriptionUpdate(event.target.value);
    },
    [handleDescriptionUpdate]
  );

  const handleSubscribe = useCallback(async (): Promise<void> => {
    try {
      await dispatch(
        thunks.updateTask({
          taskId: task!._id,
          update: { isSubscribed: true },
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, [dispatch, task]);

  const handleUnsubscribe = useCallback(async (): Promise<void> => {
    try {
      await dispatch(
        thunks.updateTask({
          taskId: task!._id,
          update: { isSubscribed: false },
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, [dispatch, task]);

  const handleLabelsChange = useCallback(
    async (labels: string[]): Promise<void> => {
      try {
        await dispatch(
          thunks.updateTask({
            taskId: task!._id,
            update: {
              labels,
            },
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleChecklistAdd = useCallback(async (): Promise<void> => {
    try {
      await dispatch(
        thunks.addChecklist({
          taskId: task!._id,
          name: "Untitled Checklist",
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, [dispatch, task]);

  const handleChecklistRename = useCallback(
    async (checklistId: string, name: string): Promise<void> => {
      try {
        await dispatch(
          thunks.updateChecklist({
            taskId: task!._id,
            checklistId,
            update: { name },
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleChecklistDelete = useCallback(
    async (checklistId: string): Promise<void> => {
      try {
        await dispatch(
          thunks.deleteChecklist({
            taskId: task!._id,
            checklistId,
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleCheckItemAdd = useCallback(
    async (checklistId: string, name: string): Promise<void> => {
      try {
        await dispatch(
          thunks.addCheckItem({
            taskId: task!._id,
            checklistId,
            name,
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleCheckItemDelete = useCallback(
    async (checklistId: string, checkItemId: string): Promise<void> => {
      try {
        await dispatch(
          thunks.deleteCheckItem({
            taskId: task!._id,
            checklistId,
            checkItemId,
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleCheckItemCheck = useCallback(
    async (checklistId: string, checkItemId: string): Promise<void> => {
      try {
        await dispatch(
          thunks.updateCheckItem({
            taskId: task!._id,
            checklistId,
            checkItemId,
            update: {
              state: "complete",
            },
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleCheckItemUncheck = useCallback(
    async (checklistId: string, checkItemId: string): Promise<void> => {
      try {
        await dispatch(
          thunks.updateCheckItem({
            taskId: task!._id,
            checklistId,
            checkItemId,
            update: {
              state: "incomplete",
            },
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleCheckItemRename = useCallback(
    async (
      checklistId: string,
      checkItemId: string,
      name: string
    ): Promise<void> => {
      try {
        await dispatch(
          thunks.updateCheckItem({
            taskId: task!._id,
            checklistId,
            checkItemId,
            update: {
              name,
            },
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const handleCommentAdd = useCallback(
    async (message: string): Promise<void> => {
      try {
        await dispatch(
          thunks.addComment({
            taskId: task!._id,
            message,
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    },
    [dispatch, task]
  );

  const [fileIndex, setFileIndex] = useState(1);

  const [isFormBeingChanged, setIsFormBeingChanged] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log("selected file", selectedFile?.name);
    setIsFormBeingChanged(true);
    if (selectedFile) {
      const newAttachment = {
        id: fileIndex,
        type: selectedFile?.type,
        name: selectedFile?.name,
        url: URL.createObjectURL(selectedFile),
      };

      // Add the new attachment to the formik values
      formik.setFieldValue("attachments", [
        ...formik.values.attachments,
        newAttachment,
      ]);

      setFileIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleFileRemove = (id: number) => {
    // Filter out the attachment with the given id
    const updatedAttachments = formik.values.attachments.filter(
      (attachment) => attachment.id !== id
    );

    // Update Formik values
    formik.setFieldValue("attachments", updatedAttachments);
  };

  const handleClose = () => {
    if (!isFormBeingChanged) {
      onClose?.();
    } else {
      // Optionally, show a message to the user that the form is being changed
      console.log(
        "Form is being changed. Please finish editing before closing."
      );
    }
  };

  useEffect(() => {
    console.log("isFormBeingChanged", isFormBeingChanged);
  }, [isFormBeingChanged]);

  const statusOptions = useMemo(() => {
    return boardColumns?.map((column) => {
      return {
        label: column.name,
        value: column._id,
      };
    });
  }, [boardColumns]);

  const content =
    task && task.column ? (
      <form onSubmit={formik.handleSubmit}>
        <Stack
          alignItems={{
            sm: "center",
          }}
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          justifyContent={{
            sm: "space-between",
          }}
          spacing={1}
          sx={{ p: 3 }}
        >
          {/* <div>
            <TaskStatus
              onChange={(columnId) =>
                handleMoveTask({
                  task_id: task!._id,
                  index: 0,
                  column_id: columnId,
                })
              }
              options={statusOptions}
              value={task.column}
            />
          </div> */}
          <IconButton
            onClick={() => {
              handleClose();
            }}
          >
            <Close />
          </IconButton>
          <Stack
            justifyContent="flex-end"
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ p: 3 }}
          >
            <IconButton
              onClick={() => {
                handleDeleteTask(task._id);
                onClose?.();
              }}
            >
              <SvgIcon>
                <ArchiveIcon />
              </SvgIcon>
            </IconButton>
            {!mdUp && (
              <IconButton onClick={onClose}>
                <SvgIcon>
                  <XIcon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
        </Stack>
        <Box sx={{ px: 1 }}>
          <Input
            disableUnderline
            fullWidth
            onBlur={handleNameBlur}
            onChange={handleNameChange}
            onKeyUp={handleNameKeyUp}
            placeholder="Task name"
            sx={(theme) => ({
              ...theme.typography.h6,
              "& .MuiInputBase-input": {
                borderRadius: 1.5,
                overflow: "hidden",
                px: 2,
                py: 1,
                textOverflow: "ellipsis",
                wordWrap: "break-word",
                "&:hover, &:focus": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "neutral.800"
                      : "neutral.100",
                },
              },
            })}
            value={nameCopy}
          />
        </Box>
        <Tabs onChange={handleTabsChange} sx={{ px: 3 }} value={currentTab}>
          <Tab value="overview" label="Overview" />
          <Tab value="checklists" label="Checklists" />
          <Tab value="comments" label="Comments" />
        </Tabs>
        <Divider />
        <Box sx={{ p: 3 }}>
          {currentTab === "overview" && (
            <Grid container spacing={3}>
              <Grid xs={12} sm={4}>
                <Typography color="text.secondary" variant="caption">
                  Created by
                </Typography>
              </Grid>
              <Grid xs={12} sm={8}>
                {task.owner && <Avatar src={task.owner.avatar || undefined} />}
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography color="text.secondary" variant="caption">
                  Assigned to
                </Typography>
              </Grid>
              <Grid xs={12} sm={8}>
                {/* <Stack
                  alignItems="center"
                  direction="row"
                  flexWrap="wrap"
                  spacing={1}
                >
                  <AvatarGroup max={5}>
                    {task.assignedTo.map((assignee) => (
                      <Avatar
                        key={assignee._id}
                        src={assignee.avatar || undefined}
                      />
                    ))}
                  </AvatarGroup>
                  <IconButton disabled>
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  </IconButton>
                </Stack> */}
                <SelectMultipleUsers
                  employees={boardMembers}
                  inputSize="small"
                  formikUsers={formik.values.members}
                  setFieldValue={(value: any) => {
                    setIsFormBeingChanged(true);
                    formik.setFieldValue("members", value);
                  }}
                  isRequired={!formik.values.members.length}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography color="text.secondary" variant="caption">
                  Attachments
                </Typography>
              </Grid>
              <Grid xs={12} sm={8}>
                <Stack
                  alignItems="start"
                  direction="column"
                  flexWrap="wrap"
                  spacing={1}
                >
                  <IconButton
                    component="label"
                    htmlFor="account-settings-upload-image"
                  >
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>

                    <input
                      hidden
                      type="file"
                      accept="*"
                      id="account-settings-upload-image"
                      onChange={handleFileChange}
                    />
                  </IconButton>

                  <Stack direction="row" width="100%" flexWrap="wrap">
                    {formik.values.attachments.map((attachment, index) => (
                      <div
                        key={attachment.id}
                        style={{
                          position: "relative",
                          marginRight: (index + 1) % 3 !== 0 ? "8px" : "0", // Adjust spacing between items
                          marginBottom: "8px", // Adjust spacing between rows
                        }}
                      >
                        {/* Render different preview components based on file type */}
                        {attachment.type.startsWith("image/") ? (
                          <Tooltip title={attachment.name}>
                            <Avatar
                              src={attachment.url}
                              sx={{ height: 70, width: 70, cursor: "pointer" }}
                              variant="rounded"
                              onClick={() =>
                                window.open(attachment.url, "_blank")
                              }
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title={attachment.name}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                width: "70px",
                                height: "70px",
                                backgroundColor: "#efefef",
                                borderRadius: "10px",
                              }}
                              onClick={() =>
                                window.open(attachment.url, "_blank")
                              }
                            >
                              <Description sx={{ fontSize: 50 }} />
                            </div>
                          </Tooltip>
                        )}

                        {/* Remove Icon */}
                        <IconButton
                          onClick={() => handleFileRemove(attachment.id)}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 1,
                            height: 25,
                            width: 25,
                          }}
                        >
                          <Close sx={{ width: "20px" }} />
                        </IconButton>
                      </div>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography color="text.secondary" variant="caption">
                  Due date
                </Typography>
              </Grid>
              <Grid xs={12} sm={8}>
                {/* {task.due && (
                  <Chip size="small" label={format(task.due, "MMM dd, yyyy")} />
                )} */}
                <DatePicker
                  views={["year", "month", "day"]}
                  sx={{ width: "100%" }}
                  value={formik.values.dueDate}
                  onChange={(date: Date | null) => {
                    setIsFormBeingChanged(true);
                    formik.setFieldValue("dueDate", date || new Date()); // Ensure a Date value is set
                  }}
                  label="Select Due Date"
                  slotProps={{
                    textField: {
                      size: "small", // Set the input size to small
                      fullWidth: true, // Make the input take full width
                    },
                  }}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography color="text.secondary" variant="caption">
                  Priority
                </Typography>
              </Grid>
              <Grid xs={12} sm={8}>
                {/* <TaskLabels
                  labels={task.labels}
                  onChange={handleLabelsChange}
                /> */}
                <FormControl fullWidth size="small">
                  <InputLabel id="label-select">Select Priority</InputLabel>
                  <Select
                    labelId="label-select"
                    id="demo-controlled-open-select"
                    value={formik.values.labels[0] || ""} // Assuming single label selection for simplicity
                    onChange={(event) => {
                      setIsFormBeingChanged(true);
                      formik.setFieldValue("labels", [event.target.value]); // Replace array with selected value
                    }}
                    label="Select Priority"
                  >
                    {/* <MenuItem value="">None</MenuItem> */}
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={4}>
                <Typography color="text.secondary" variant="caption">
                  Description
                </Typography>
              </Grid>
              <Grid xs={12} sm={8}>
                <Input
                  // defaultValue={task.description}
                  value={formik.values.description}
                  onChange={(e) => {
                    setIsFormBeingChanged(true);
                    formik.setFieldValue("description", e.target.value);
                  }}
                  fullWidth
                  multiline
                  disableUnderline
                  // onChange={handleDescriptionChange}
                  placeholder="Leave a message"
                  rows={6}
                  sx={{
                    borderColor: "divider",
                    borderRadius: 1,
                    borderStyle: "solid",
                    borderWidth: 1,
                    p: 1,
                  }}
                />
              </Grid>

              <Grid xs={12}>
                <Stack direction={"row"} justifyContent={"flex-end"}>
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          )}
          {currentTab === "checklists" && (
            <Stack spacing={2}>
              {/* {task.checklists.map((checklist) => (
                <TaskChecklist
                  key={checklist.id}
                  checklist={checklist}
                  onCheckItemAdd={(name) =>
                    handleCheckItemAdd(checklist.id, name)
                  }
                  onCheckItemDelete={(checkItemId) =>
                    handleCheckItemDelete(checklist.id, checkItemId)
                  }
                  onCheckItemCheck={(checkItemId) =>
                    handleCheckItemCheck(checklist.id, checkItemId)
                  }
                  onCheckItemUncheck={(checkItemId) =>
                    handleCheckItemUncheck(checklist.id, checkItemId)
                  }
                  onCheckItemRename={(checkItemId, name) =>
                    handleCheckItemRename(checklist.id, checkItemId, name)
                  }
                  onDelete={() => handleChecklistDelete(checklist.id)}
                  onRename={(name) => handleChecklistRename(checklist.id, name)}
                />
              ))} */}
              <Button
                startIcon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                onClick={handleChecklistAdd}
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          )}
          {currentTab === "comments" && (
            <Stack spacing={2}>
              {/* {task.comments.map((comment) => (
                <TaskComment key={comment.id} comment={comment} />
              ))} */}
              <TaskCommentAdd avatar={user.avatar} onAdd={handleCommentAdd} />
            </Stack>
          )}
        </Box>
      </form>
    ) : null;
  return (
    <Drawer
      anchor="right"
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 500,
        },
      }}
      {...other}
    >
      {content}
    </Drawer>
  );
};

// TaskModal.propTypes = {
//   onClose: PropTypes.func,
//   open: PropTypes.bool,
//   taskId: PropTypes.string,
// };
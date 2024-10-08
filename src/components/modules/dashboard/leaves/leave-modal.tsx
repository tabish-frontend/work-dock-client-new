import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Paper,
  ListItemText,
  Avatar,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";

import { useEffect, useState, type FC } from "react";
import { leaveInitialValues } from "src/formik";

import { employeesApi } from "src/api";
import { LeavesStatus, LeavesTypes } from "src/constants/status";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { DatePicker } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";

interface LeaveModalProps {
  modal: boolean;
  modalType: string | undefined;
  leaveValues: any;
  onConfirm: (values: any) => void;
  showEmployees: boolean;
  onCancel: () => void;
}

export const LeaveModal: FC<LeaveModalProps> = ({
  modal,
  modalType,
  leaveValues,
  onCancel,
  showEmployees,
  onConfirm,
}) => {
  const formik = useFormik({
    initialValues: leaveValues
      ? {
          ...leaveValues,
          startDate: new Date(leaveValues.startDate),
          endDate: new Date(leaveValues.endDate),
          user: leaveValues.user._id,
          status: LeavesStatus.Pending,
        }
      : leaveInitialValues,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      await onConfirm(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  // HR ROLE --> STATES AND FUNCTIONS
  const [employees, setEmployees] = useState<any[]>(
    leaveValues ? [leaveValues.user] : []
  );

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees({
      fields: "full_name,avatar",
      account_status: "active",
      search: "",
      role: "",
    });
    setEmployees(response.users);
  };

  useEffect(() => {
    if (showEmployees && modalType === "create") {
      handleGetEmployees();
    }
  }, [modalType, showEmployees]);

  return (
    <Dialog fullWidth maxWidth="sm" open={modal} >
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            {modalType === "create" ? "Add Leave" : "Update Leave"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onCancel}
            sx={{
              position: "absolute",
              right: 12,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseCircleOutline />
          </IconButton>

          <Divider />

          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Leave Type"
                name="leave_type"
                select
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.leave_type}
              >
                {LeavesTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Leave From"
                views={["year", "month", "day"]}
                sx={{ width: "100%" }}
                value={formik.values.startDate}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
                onChange={(date) => {
                  if (date) {
                    date.setHours(23, 0, 0, 0);
                    formik.setFieldValue("startDate", date);
                    formik.setFieldValue("endDate", date);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Leave to"
                sx={{ width: "100%" }}
                minDate={formik.values.startDate || new Date()}
                views={["year", "month", "day"]}
                value={formik.values.endDate}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
                onChange={(date) => {
                  if (date) {
                    // Set the time to 11 PM
                    date.setHours(23, 0, 0, 0);
                    formik.setFieldValue("endDate", date);
                  }
                }}
              />
            </Grid>

            {showEmployees && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Employee"
                  name="user"
                  disabled={modalType === "update"}
                  select
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.user}
                >
                  {employees.map(({ _id, full_name, avatar }: any) => (
                    <MenuItem key={_id} value={_id}>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Avatar
                          alt="user"
                          src={avatar}
                          sx={{ width: "1.5rem", height: "1.5rem", m: 1 }}
                        />
                        <ListItemText primary={full_name} />
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="reason"
                value={formik.values.reason}
                label="Leave Reason"
                multiline
                rows={2}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              pb: 3,
              px: 3,
            }}
          >
            <Button color="inherit" sx={{ mr: 2 }} onClick={onCancel}>
              Cancel
            </Button>

            <LoadingButton
              loading={formik.isSubmitting}
              loadingPosition="start"
              startIcon={<></>}
              type="submit"
              variant="contained"
              sx={{
                pl: formik.isSubmitting ? "40px" : "16px",
              }}
            >
              Save
            </LoadingButton>
          </Box>
        </Paper>
      </form>
    </Dialog>
  );
};

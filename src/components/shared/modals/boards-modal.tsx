import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";
import { useEffect, useState, type FC } from "react";
import { employeesApi } from "src/api";
import { Employee } from "src/types";
import { SelectMultipleUsers } from "src/components/shared";
import { LoadingButton } from "@mui/lab";

interface BoardsModalProps {
  modal: boolean;
  modalType: string;
  modalValues: any;
  onCancel: () => void;
}

export const BoardsModal: FC<BoardsModalProps> = ({
  modal,
  modalType,
  modalValues,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: { title: "", description: "", users: [] },

    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);

      // API will CAll here
    },
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees({
      fields: "full_name,avatar,department",
      account_status: "active",
      search: "",
    });
    setEmployees(response.users);
  };

  useEffect(() => {
    handleGetEmployees();
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={modal}
      onClose={onCancel}
      sx={{ "& .MuiPaper-root": { overflowY: "unset" } }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            {modalType === "create" ? "Add Board" : "Update Board"}
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
                label="Board Name"
                required
                value={formik.values.title}
                name="boardname"
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                required
                value={formik.values.description}
                name="description"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectMultipleUsers
                employees={employees}
                formikUsers={formik.values.users}
                setFieldValue={(value: any) =>
                  formik.setFieldValue("users", value)
                }
                isRequired={!formik.values.users.length}
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

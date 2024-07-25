import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { DashboardLayout } from "src/layouts/dashboard";
import { NextPage } from "next";
import { Employee } from "src/types";
import { useRouter } from "next/router";
import { employeesApi } from "src/api";
import {
  EmployeeDetails,
  ShiftDetails,
  AttendanceChartCard,
  TaskCard,
  LeavesCard,
  ConfirmationModal,
} from "src/components/shared";
import { useDialog, useSettings } from "src/hooks";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";

const EmployeeProfileComponent = () => {
  const settings = useSettings();

  const router = useRouter();
  const { username } = router.query;

  const [employeeData, setEmployeeData] = useState<Employee | undefined>();

  const DeleteEmployeeDialog = useDialog();

  const handleGetEmployee = useCallback(async () => {
    if (!username) return;

    // setIsLoading(true)
    const response = await employeesApi.getEmployee(username);
    setEmployeeData(response);
  }, [username]);

  const handleUpdateEmployee = async (values: any) => {
    const { username, ...UpdatedValues } = values;

    const response = await employeesApi.updateEmployee(username, UpdatedValues);

    setEmployeeData(response);
  };

  const handleDeleteEmployee = async () => {
    if (!username) return null;
    await employeesApi.deleteEmployee(username);
    DeleteEmployeeDialog.handleClose();
    router.back();
  };

  useEffect(() => {
    handleGetEmployee();
  }, [handleGetEmployee]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth={settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box display="flex" alignItems={"center"}>
                  <Tooltip title="Back">
                    <Button
                      onClick={() => router.back()}
                      color="inherit"
                      size="small"
                    >
                      <SvgIcon>
                        <ArrowLeftIcon />
                      </SvgIcon>
                    </Button>
                  </Tooltip>
                  <Typography variant="h5">{"Employee Profile"}</Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="small"
                  onClick={() => DeleteEmployeeDialog.handleOpen()}
                >
                  Delete Employee
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={7}>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <EmployeeDetails
                  employeeData={employeeData}
                  UpdateEmployee={handleUpdateEmployee}
                />
              </Grid>

              <Grid item xs={12}>
                <ShiftDetails
                  employeeID={employeeData?._id}
                  shiftDetails={employeeData?.shift}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid item xs={12}>
                <TaskCard />
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <AttendanceChartCard employeeUsername={employeeData?._id} />
            </Grid>
            <Grid item xs={12} md={8}>
              <LeavesCard employeeId={employeeData?._id} />
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {DeleteEmployeeDialog.open && (
        <ConfirmationModal
          modal={DeleteEmployeeDialog.open}
          onCancel={DeleteEmployeeDialog.handleClose}
          onConfirm={handleDeleteEmployee}
          content={{
            type: "Delete",
            text: "Are you sure you want to delete the Employee ?",
          }}
        />
      )}
    </Box>
  );
};
const EmployeeProfile: NextPage = () => {
  return <EmployeeProfileComponent />;
};
EmployeeProfile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export { EmployeeProfile };

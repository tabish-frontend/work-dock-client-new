import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { DashboardLayout } from "src/layouts/dashboard";
import { NextPage } from "next";
import { Employee } from "src/types";
import { useRouter } from "next/router";
import { employeesApi } from "src/api";
import { EmployeeDetails, ShiftDetails } from "src/components";
import { useSettings } from "src/hooks";

const EmployeeProfileComponent = () => {
  const settings = useSettings();

  const router = useRouter();
  const { username } = router.query;

  const [employeeData, setEmployeeData] = useState<Employee | undefined>();

  // Memoize the handleGetEmployee function
  const handleGetEmployee = useCallback(async () => {
    if (!username) return;

    const response = await employeesApi.getEmployee(username);
    setEmployeeData(response);
  }, [username]); // Memoize based on username

  const handleUpdateEmployee = async (values: any) => {
    const { username, ...UpdatedValues } = values;

    const response = await employeesApi.updateEmployee(username, UpdatedValues);

    setEmployeeData(response);
  };

  // useEffect to call handleGetEmployee when username changes
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
              <Typography variant="h5">{"Employee Profile"}</Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <EmployeeDetails
                employeeData={employeeData}
                UpdateEmployee={handleUpdateEmployee}
              />
            </Grid>

            <Grid item xs={12} sm={5}></Grid>

            <Grid item xs={12} sm={7}>
              <ShiftDetails
                employeeID={employeeData?._id}
                shiftDetails={employeeData?.shift}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};
const EmployeeProfile: NextPage = () => {
  return <EmployeeProfileComponent />;
};
EmployeeProfile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export { EmployeeProfile };

// ** MUI Imports
import {
  Button,
  Container,
  Stack,
  SvgIcon,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Plus } from "mdi-material-ui";
import { SyntheticEvent, useEffect, useState } from "react";

// ** Demo Components Imports
import { EmployeeCard, Scrollbar } from "src/components";
import { Employee } from "src/types";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { employeesApi } from "src/api";
import { useRouter } from "next/router";
import { useSettings } from "src/hooks";
import { AccountStatus } from "src/constants/status";

const EmployeeListComponent = () => {
  const router = useRouter();
  const settings = useSettings();
  const theme = useTheme();

  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [statusValue, setStatusValue] = useState<string | string[]>("active");

  const handleStatusChange = (event: SyntheticEvent, newValue: string) => {
    setStatusValue(newValue);
  };

  const handleGetEmployees = async () => {
    setIsLoading(true);
    const response = await employeesApi.getAllEmployees(statusValue);
    setEmployeesList(response.users);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusValue]);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          <Stack direction={"row"} justifyContent="space-between" spacing={4}>
            <Typography variant="h4">{"Employee's"}</Typography>

            <Button
              variant="contained"
              size={isSmallScreen ? "small" : "medium"}
              onClick={() => router.push(`${router.pathname}/new`)}
              startIcon={
                <SvgIcon>
                  <Plus />
                </SvgIcon>
              }
            >
              Add Employee
            </Button>
          </Stack>

          <Tabs
            indicatorColor="primary"
            onChange={handleStatusChange}
            value={statusValue}
            sx={{
              borderBottom: 1,
              borderColor: "#ddd",
            }}
          >
            {AccountStatus.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                disabled={isLoading}
              />
            ))}
          </Tabs>

          <Box>
            <Scrollbar sx={{ maxHeight: 650, overflowY: "auto", py: 3 }}>
              <Grid container spacing={2}>
                {isLoading ? (
                  [...Array(9)].map((_, index) => (
                    <Grid item xs={12} xl={4} lg={6} key={index}>
                      <EmployeeCard isLoading={isLoading} />
                    </Grid>
                  ))
                ) : employeesList.length === 0 ? (
                  <Grid item xs={12}>
                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <img
                        width={isSmallScreen ? 200 : 460}
                        height={isSmallScreen ? 150 : 360}
                        src="/images/pages/nodata.png"
                        alt="no-data-found"
                      />
                    </Stack>
                  </Grid>
                ) : (
                  employeesList.map((employee: Employee) => (
                    <Grid item xs={12} xl={4} lg={6} key={employee._id}>
                      <EmployeeCard employee={employee} isLoading={isLoading} />
                    </Grid>
                  ))
                )}
              </Grid>
            </Scrollbar>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

const EmployeeList: NextPage = () => {
  return <EmployeeListComponent />;
};

EmployeeList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { EmployeeList };

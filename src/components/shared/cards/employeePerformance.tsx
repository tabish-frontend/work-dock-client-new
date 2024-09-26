// ** React Imports
import { ReactElement, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import {
  Cancel,
  CheckboxMarkedOutline,
  ClockTimeTwoOutline,
  UmbrellaBeachOutline,
} from "mdi-material-ui";
import { statisticsApi } from "src/api";
import { Tooltip } from "@mui/material";
import { UsersListPopover } from "../lists";

export const EmployeePerformanceCard = () => {
  const [employeesAvailability, setEmployeesAvailability] = useState<any>([
    {
      key: "present",
      title: "Present",
      color: "primary",
      icon: CheckboxMarkedOutline,
      values: [],
    },
    {
      key: "on_late",
      title: "Late",
      color: "success",
      icon: ClockTimeTwoOutline,
      values: [],
    },
    {
      key: "absent",
      title: "Absent",
      color: "warning",
      icon: Cancel,
      values: [],
    },
    {
      key: "leave",
      title: "Leave",
      color: "info",
      icon: UmbrellaBeachOutline,
      values: [],
    },
  ]);

  useEffect(() => {
    const handleGetTodayAvailability = async () => {
      const response = await statisticsApi.getAllUserAvailability();
      setEmployeesAvailability((prevAvailability: any) =>
        prevAvailability.map((availability: any) => ({
          ...availability,
          values: response.data[availability.key] || [],
        }))
      );
    };

    handleGetTodayAvailability();
  }, []);

  return (
    <Card>
      <CardHeader
        title="Employees Statistics"
        // action={
        //   <IconButton
        //     size="small"
        //     aria-label="settings"
        //     className="card-more-options"
        //     sx={{ color: "text.secondary" }}
        //   >
        //     <DotsVertical />
        //   </IconButton>
        // }
        // subheader={
        //   <Typography variant="body2">
        //     <Box
        //       component="span"
        //       sx={{ fontWeight: 600, color: "text.primary" }}
        //     >
        //       Total 48.5% growth
        //     </Box>{" "}
        //     😎 this month
        //   </Typography>
        // }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {employeesAvailability.map((availability: any, index: number) => {
            const employees = availability.values;
            const Icon = availability.icon;

            return (
              <Grid item xs={12} sm={3} key={index}>
                <Tooltip
                  arrow
                  placement={
                    index === 0 || index === 2 ? "left-start" : "right-start"
                  }
                  title={
                    employees.length ? (
                      <UsersListPopover users={employees} />
                    ) : (
                      ""
                    )
                  }
                >
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        mr: 3,
                        width: 44,
                        height: 44,
                        boxShadow: 3,
                        color: "common.white",
                        backgroundColor: `${availability.color}.main`,
                      }}
                    >
                      <Icon fontSize="large" sx={{ fontWeight: 900 }} />
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="subtitle1">
                        {availability.title}
                      </Typography>
                      <Typography variant="h5">{employees.length}</Typography>
                    </Box>
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

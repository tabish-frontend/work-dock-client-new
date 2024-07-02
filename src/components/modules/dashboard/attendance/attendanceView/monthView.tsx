import {
  Link,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ImageAvatar,
  NoRecordFound,
  RouterLink,
  Scrollbar,
} from "src/components/shared";
import { paths } from "src/constants/paths";
import { CellValues } from "../helper";
import dayjs from "dayjs";

export const MonthViewAttendance = ({ employeesAttendance, filters }: any) => {
  const daysInMonth = dayjs(filters.date).daysInMonth();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Scrollbar sx={{ maxHeight: 600, overflowY: "auto" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                }}
              >
                Employee
              </TableCell>
              {[...Array(daysInMonth)].map((_, index) => (
                <TableCell key={`header-${index + 1}`}>
                  <Typography variant="caption">{index + 1}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {employeesAttendance.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    p: 1,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  {isSmallScreen ? (
                    <Stack
                      direction="row"
                      justifyContent={"center"}
                      spacing={1}
                      width={80}
                    >
                      <Tooltip title={item.full_name} arrow>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          href={`${paths.employees}/${item.username}`}
                        >
                          <ImageAvatar
                            path={item.avatar || ""}
                            alt="user image"
                            width={40}
                            height={40}
                          />
                        </Link>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Stack
                      alignItems={"center"}
                      direction={"row"}
                      justifyContent={"center"}
                      spacing={1}
                      width={150}
                    >
                      <ImageAvatar
                        path={item.avatar || ""}
                        alt="user image"
                        width={40}
                        height={40}
                      />

                      <Link
                        color="inherit"
                        component={RouterLink}
                        href={`${paths.employees}/${item.username}`}
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {item.full_name}
                      </Link>
                    </Stack>
                  )}
                </TableCell>

                {[...Array(daysInMonth)].map((_, dayIndex) => {
                  const date = dayjs(filters.date)
                    .set("date", dayIndex + 1)
                    .toDate();

                  const attendanceValues = CellValues(item, date);

                  return (
                    <TableCell
                      key={`attendance-${index}-${dayIndex}`}
                      sx={{ p: 0, cursor: "pointer" }}
                      align="center"
                    >
                      <Tooltip title={attendanceValues?.tooltip} arrow>
                        <span>{attendanceValues.icon}</span>
                      </Tooltip>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
};

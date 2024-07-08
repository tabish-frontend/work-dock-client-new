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
                  <Stack
                    direction={"row"}
                    component={RouterLink}
                    color="inherit"
                    href={`${paths.employees}/${item.username}`}
                    gap={1}
                    width={isSmallScreen ? 80 : 150}
                    alignItems={"center"}
                  >
                    <Tooltip title={item.full_name} arrow>
                      <span>
                        <ImageAvatar
                          path={item.avatar || ""}
                          alt="user image"
                          width={30}
                          height={30}
                        />
                      </span>
                    </Tooltip>

                    {!isSmallScreen && item.full_name}
                  </Stack>
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
                      onClick={
                        () => attendanceValues?.open && {}
                        // setModal({
                        //   open: true,
                        //   classId: item._id,
                        //   absent:
                        //     durationToShow?.status ===
                        //     "Absent",
                        //   session:
                        //     transformLogSession(
                        //       __session
                        //     ),
                        // })
                      }
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

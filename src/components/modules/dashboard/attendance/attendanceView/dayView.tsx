// ** MUI Imports
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { CellValues } from "../helper";
import {
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NoRecordFound, RouterLink } from "src/components/shared";
import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { EditAttendanceModal } from "./edit-attendance";
import { formatTime } from "src/utils";
import { useDialog } from "src/hooks";
import { Scrollbar } from "src/utils/scrollbar";
import { paths } from "src/constants/paths";

const columns = [
  "Full Name",
  "Shift Type",
  "Shift Start",
  "Shift End",
  "Working Hours",
  "ClockIn Time",
  "ClockOut Time",
  "Break Start/End",
  "Duration",
  "Status",
];

interface ModalValuesTypes {
  id: string;
  clockInTime: null | Date;
  clockOutTime: null | Date;
}

export const DayViewAttendance = ({
  employeesAttendance,
  filters,
  handleEditAttendance,
}: any) => {
  const EditAttendanceDialog = useDialog<{ values: ModalValuesTypes }>();

  return (
    <Paper sx={{ overflowX: "auto" }}>
      <TableContainer>
        <Scrollbar sx={{ maxHeight: 470 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index} align="center">
                    <span style={{ fontWeight: 700 }}>{column}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {employeesAttendance.map((attendance: any, index: number) => {
                const attendanceValues = CellValues(attendance, filters.date);

                return (
                  <TableRow hover key={index}>
                    <TableCell align="center">
                      <Typography
                        width={150}
                        display={"block"}
                        component={RouterLink}
                        href={`${paths.employees}/${attendance.username}`}
                        color="inherit"
                        variant="body2"
                      >
                        {attendance.full_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography width={100}>
                        {attendanceValues.shift.type}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography width={150}>
                        {attendanceValues.shift.start}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography width={150}>
                        {attendanceValues.shift.end}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography width={150}>
                        {attendanceValues.shift.hours}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography width={150}>
                        {attendanceValues.attendance.clockIn
                          ? formatTime(attendanceValues.attendance.clockIn)
                          : "--"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography width={150}>
                        {attendanceValues.attendance.clockOut
                          ? formatTime(attendanceValues.attendance.clockOut)
                          : "--"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      {!attendanceValues.attendance.breaks?.length ? (
                        "--"
                      ) : attendanceValues.attendance.breaks.length > 1 ? (
                        <TextField
                          select
                          variant="standard"
                          defaultValue={
                            attendanceValues.attendance.breaks[0]._id
                          }
                          InputProps={{
                            disableUnderline: true,
                          }}
                        >
                          {attendanceValues.attendance.breaks.map(
                            (item: any, index: number) => (
                              <MenuItem key={item._id} value={item._id}>
                                {formatTime(item.start)} -{" "}
                                {item.end ? formatTime(item.end) : "not yet"}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      ) : (
                        <Typography width={200}>
                          {`${formatTime(
                            attendanceValues.attendance.breaks[0].start
                          )} - ${
                            attendanceValues.attendance.breaks[0].end
                              ? formatTime(
                                  attendanceValues.attendance.breaks[0].end
                                )
                              : " not yet"
                          }`}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Typography width={150}>
                        {attendanceValues.attendance.duration}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {attendanceValues.open ? (
                        <Stack
                          width={150}
                          direction={"row"}
                          justifyContent={"center"}
                          gap={1}
                        >
                          {attendanceValues.status}

                          <EditOutlinedIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              EditAttendanceDialog.handleOpen({
                                values: {
                                  id: attendanceValues.attendance.id,
                                  clockInTime:
                                    new Date(
                                      attendanceValues.attendance.clockIn
                                    ) || null,
                                  clockOutTime: attendanceValues.attendance
                                    .clockOut
                                    ? new Date(
                                        attendanceValues.attendance.clockOut
                                      )
                                    : null,
                                },
                              })
                            }
                          />
                        </Stack>
                      ) : (
                        <Typography width={150}>
                          {attendanceValues.status}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {EditAttendanceDialog.open && (
        <EditAttendanceModal
          attendanceValues={EditAttendanceDialog.data?.values}
          modal={EditAttendanceDialog.open}
          onCancel={EditAttendanceDialog.handleClose}
          onConfirm={handleEditAttendance}
        />
      )}
    </Paper>
  );
};

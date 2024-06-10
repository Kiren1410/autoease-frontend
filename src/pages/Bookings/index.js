import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Container,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import {
  getBooking,
  updateBooking,
  deleteBooking,
} from "../../utils/api_booking";
import { useCookies } from "react-cookie";
import Header from "../../components/Header";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInTime = end - start;
  return Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1; // +1 for inclusive counting
};

const calculateTotalPrice = (vehicles, totalDays) => {
  let total = 0;
  vehicles.forEach((vehicle) => {
    total += vehicle.price * totalDays;
  });
  return total.toFixed(2);
};

export default function Bookings() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: bookings = [] } = useQuery({
    queryKey: ["booking", token],
    queryFn: () => getBooking(token),
  });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      enqueueSnackbar("Booking Deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleRemoveBooking = (_id) => {
    const answer = window.confirm("Remove Booking?");
    if (answer) {
      deleteBookingMutation.mutate({
        _id: _id,
        token: token,
      });
    }
  };

  const updateBookingMutation = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      enqueueSnackbar("Booking Updated", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleUpdateBooking = (booking, status) => {
    const totalDays = calculateTotalDays(booking.startDate, booking.endDate);
    const totalPrice = calculateTotalPrice(booking.vehicles, totalDays);

    updateBookingMutation.mutate({
      ...booking,
      status: status,
      totalPrice: totalPrice,
      token,
    });
  };

  return (
    <>
      <Header />
      <Container align="center" sx={{ marginTop: 10, marginBottom: 10 }}>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "1200px" }}
          align="center"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Vehicles</TableCell>
                <TableCell align="left">Total Amount</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Start Date</TableCell>
                <TableCell align="left">End Date</TableCell>
                <TableCell align="left">Payment Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {bookings.length > 0 ? (
              <TableBody>
                {bookings.map((booking) => {
                  const totalDays = calculateTotalDays(
                    booking.startDate,
                    booking.endDate
                  );
                  const totalPrice = calculateTotalPrice(
                    booking.vehicles,
                    totalDays
                  );

                  return (
                    <TableRow key={booking._id}>
                      <TableCell align="left">
                        {booking.customerName}
                        <br />({booking.customerEmail})
                      </TableCell>

                      <TableCell align="left">
                        {booking.vehicles.map((vehicle) => (
                          <Typography
                            key={vehicle.name}
                            variant="p"
                            display={"flex"}
                          >
                            {vehicle.name}
                          </Typography>
                        ))}
                      </TableCell>

                      <TableCell align="left">${totalPrice}</TableCell>

                      <TableCell align="left">
                        <Select
                          fullWidth
                          value={booking.status}
                          label="status"
                          disabled={booking.status === "pending"}
                          onChange={(e) => {
                            handleUpdateBooking(booking, e.target.value);
                          }}
                        >
                          <MenuItem value={"pending"} disabled>
                            Pending
                          </MenuItem>
                          <MenuItem value={"paid"}>Paid</MenuItem>
                          <MenuItem value={"failed"}>Failed</MenuItem>
                          <MenuItem value={"completed"}>Completed</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(booking.startDate)}</TableCell>
                      <TableCell>{formatDate(booking.endDate)}</TableCell>
                      <TableCell>{formatDate(booking.paid_at)}</TableCell>
                      <TableCell align="right">
                        {booking.status === "pending" && (
                          <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                              handleRemoveBooking(booking._id);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="h6">No Bookings</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Container, Grid, Typography, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { getDetail, emptyDetail } from "../../utils/api_detail";
import { getVehicle } from "../../utils/api_vehicles";
import { addNewBooking } from "../../utils/api_booking";
import { addNewDates, getDates } from "../../utils/api_date";
import { useParams, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const { vehicleId } = location.state;
  console.log(vehicleId);
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const todayDate = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayDate);
  const [endDate, setEndDate] = useState(todayDate);
  const [bookedStartDate, setBookedStartDate] = useState([]);
  const [bookedEndDate, setBookedEndDate] = useState([]);

  const { data: detail = [] } = useQuery({
    queryKey: ["detail"],
    queryFn: getDetail,
  });

  const { data: dates = [] } = useQuery({
    queryKey: ["dates", vehicleId],
    queryFn: () => getDates(vehicleId),
  });

  const { data: vehicle = [] } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicle(id),
  });

  const addNewOrderMutation = useMutation({
    mutationFn: addNewBooking,
    onSuccess: (responseData) => {
      emptyDetail();
      const billplz_url = responseData.billplz_url;
      window.location.href = billplz_url;
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const addNewDateMutation = useMutation({
    mutationFn: addNewDates,
    onSuccess: () => {
      emptyDetail();
      enqueueSnackbar("Booking Date Available", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const calculateTotalDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays >= 0 ? differenceInDays + 1 : 0; // +1 to include the start date
  };
  const calculateTotalAmount = () => {
    const totalDays = calculateTotalDays();
    const totalPrice = detail.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return totalDays * totalPrice;
  };

  const handleCheckout = () => {
    if (name === "" || email === "") {
      enqueueSnackbar("Please fill up all the fields", {
        variant: "error",
      });
    } else if (startDate > endDate) {
      enqueueSnackbar("Please choose a valid date", {
        variant: "error",
      });
    } else if (!(detail && detail.length > 0)) {
      enqueueSnackbar("You havent selected a vehicle", {
        variant: "error",
      });
    } else if (
      bookedStartDate.includes(startDate) &&
      bookedEndDate.includes(endDate)
    ) {
      enqueueSnackbar("Selected dates are already booked", {
        variant: "error",
      });
    } else {
      addNewOrderMutation.mutate({
        customerName: name,
        customerEmail: email,
        vehicles: detail,
        totalPrice: calculateTotalAmount(),
        token: token,
        startDate: startDate,
        endDate: endDate,
      });
      addNewDateMutation.mutate({
        vehicleId: vehicle._id,
        startDate: startDate,
        endDate: endDate,
      });
    }
  };

  useEffect(() => {
    if (dates.length > 0) {
      const bookedStartDate = dates.map((date) => formatDate(date.startDate));
      const bookedEndDate = dates.map((date) => formatDate(date.endDate));
      setBookedStartDate(bookedStartDate);
      setBookedEndDate(bookedEndDate);
    }
  }, [dates]);

  console.log(bookedStartDate, "this is startdate");
  console.log(bookedEndDate, "this is endDate");

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          sx={{
            paddingTop: "60px",
            flexDirection: {
              xs: "column-reverse",
              sm: "column-reverse",
              md: "row",
            },
          }}
        >
          <Grid item xs={12} md={7}>
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: "bold", marginBottom: "20px" }}
            >
              Contact Information
            </Typography>
            <TextField
              required
              placeholder="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              required
              placeholder="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              type="date"
              label="Start Date"
              variant="outlined"
              fullWidth
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              type="date"
              label="End Date"
              variant="outlined"
              fullWidth
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              sx={{ marginTop: "20px" }}
            >
              Pay ${calculateTotalAmount()} now
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: "bold", marginBottom: "20px" }}
            >
              Your Booking Summary
            </Typography>
            <div style={{ marginBottom: "20px" }}>
              <Typography>
                Selected Dates: {startDate} to {endDate}
              </Typography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <Typography>Currently Booked Dates:</Typography>
              <ul>
                {bookedStartDate.map((date, index) => (
                  <li key={index}>
                    {date} to {bookedEndDate[index]}
                  </li>
                ))}
              </ul>
            </div>
            {detail.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <Typography>{item.name}</Typography>
                <Typography>$Price Per Day {item.price.toFixed(2)}</Typography>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${calculateTotalAmount()}</Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

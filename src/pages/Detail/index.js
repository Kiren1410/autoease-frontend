import { Container, Typography, Grid, Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/Header";
import { getDetail } from "../../utils/api_detail";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicle } from "../../utils/api_vehicles";

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: detail = [] } = useQuery({
    queryKey: ["detail"],
    queryFn: getDetail,
  });

  const handleBooking = () => {
    const url = `/checkout/${vehicle._id}`;
    navigate(url, {
      state: {
        vehicleId: vehicle._id,
      },
    });
  };

  const { data: vehicle = [] } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicle(id),
  });

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          sx={{ paddingTop: "60px", marginBottom: 10 }}
        >
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Vehicle Image
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: "400px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={
                  detail.length > 0
                    ? "http://localhost:5000/" + detail[0].image
                    : "http://localhost:5000/uploads/default_image.png"
                }
                alt="Vehicle"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", marginTop: "20px" }}
              >
                Vehicle Details
              </Typography>
              {detail.length > 0 && (
                <Box>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Name:</strong> {detail[0].name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price Per Day:</strong> $
                    {detail[0].price.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Description:</strong> {detail[0].description}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
                height="100%"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBooking}
                  sx={{ marginBottom: "20px" }}
                >
                  Proceed To Booking
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

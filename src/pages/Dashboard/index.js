import { Container, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleAddVehicles = () => {
    navigate("/add");
  };

  const handleAddCategories = () => {
    navigate("/category");
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ paddingTop: "60px" }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: "40px", textAlign: "center" }}
        >
          Admin Dashboard
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "20px" }}
              onClick={handleAddVehicles}
            >
              Add Vehicles
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ padding: "20px" }}
              onClick={handleAddCategories}
            >
              Add Categories
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

import { useState } from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Chip,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVehicle } from "../../utils/api_vehicles";
import { useSnackbar } from "notistack";
import { addToDetails } from "../../utils/api_detail";
import { useCookies } from "react-cookie";
import { Inventory2 } from "@mui/icons-material";

export default function GridList(props) {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    cards = [],
    categories = [],
    category = "all",
    setCategory,
    setPage,
  } = props;

  const addToDetailMutation = useMutation({
    mutationFn: addToDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Vehicle is deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleBookNow = (card) => {
    if (!currentUser || !currentUser.email) {
      enqueueSnackbar("Please Login First", { variant: "error" });
    } else {
      navigate("/detail/" + card._id);
      addToDetailMutation.mutate(card);
    }
  };

  return (
    <>
      <Container>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent>
                  <img
                    src={
                      "http://localhost:5000/" +
                      (card.image && card.image !== ""
                        ? card.image
                        : "uploads/default_image.png")
                    }
                    alt="image"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ marginTop: "8px", marginBottom: "8px" }}
                  >
                    {card.name}
                  </Typography>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    sx={{ marginTop: "8px", marginBottom: "8px" }}
                  >
                    <Chip
                      avatar={<Avatar>$</Avatar>}
                      label={card.price}
                      color="success"
                    />
                    <Chip
                      icon={<Inventory2 />}
                      label={
                        card.category && card.category.name
                          ? card.category.name
                          : ""
                      }
                      color="warning"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: "8px", marginBottom: "8px" }}
                    onClick={() => handleBookNow(card)}
                  >
                    Book Now
                  </Button>
                  {role && role === "admin" ? (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      sx={{ marginTop: "8px", marginBottom: "8px" }}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ width: "100px" }}
                        onClick={() => {
                          navigate("/vehicles/" + card._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ width: "100px" }}
                        onClick={() => {
                          const confirm = window.confirm(
                            "Are you sure you want to delete this vehicle?"
                          );
                          if (confirm) {
                            deleteVehicleMutation.mutate({
                              _id: card._id,
                              token: token,
                            });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {cards.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" sx={{ padding: "10px 0" }}>
                No items found.
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </>
  );
}

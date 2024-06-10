import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { getVehicle, updateVehicle } from "../../utils/api_vehicles";
import { uploadImage } from "../../utils/api_images";
import { useCookies } from "react-cookie";
import { getCategories } from "../../utils/api_categories";

export default function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const { role } = currentUser;

  useEffect(() => {
    if (!cookies.currentUser) {
      navigate("/login");
      enqueueSnackbar("Please Login before Access this page", {
        variant: "error",
      });
    }
  });
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      enqueueSnackbar("You have no permissions to access this Page", {
        variant: "error",
      });
    }
  });

  // get data from vehicle api: /vehicles/:id
  const {
    data: vehicle,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicle(id),
  });

  //load categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // when data is fetched from API, set the states for all the fields with its current value
  useEffect(() => {
    // if vehicle is not undefined
    if (vehicle) {
      setName(vehicle.name);
      setDescription(vehicle.description);
      setPrice(vehicle.price);
      setCategory(vehicle.category);
      setImage(vehicle.image ? vehicle.image : "");
    }
  }, [vehicle]);

  // setup mutation for Edit vehicle
  const updateVehicleMutation = useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      enqueueSnackbar("Vehicle is Updated", { variant: "success" });
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      // alert(error.response.data.message);
    },
  });

  //upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image_url);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleImageUpload = (event) => {
    // console.log(event.target.files[0]);
    uploadImageMutation.mutate(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // trigger the mutation to call the API
    updateVehicleMutation.mutate({
      id: id,
      name: name,
      description: description,
      price: price,
      category: category,
      image: image,
      token: token,
    });
  };

  // if API data haven't return yet
  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  // if there is an error in API call
  if (error) {
    return <Container>{error.response.data.message}</Container>;
  }

  return (
    <Container>
      <Header />
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              margin: "20px 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Edit Vehicle
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ marginTop: "10px", width: "200px", marginLeft: "10px" }}
              >
                <InputLabel id="product-select-label">Category</InputLabel>
                <Select
                  labelId="product-select-label"
                  id="product-select"
                  label="Category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                  }}
                >
                  {categories.map((category) => {
                    return (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {image !== "" ? (
                <>
                  <div>
                    <img
                      src={"http://localhost:5000/" + image}
                      width="300px"
                      height="300px"
                      alt="item"
                    />
                  </div>

                  <Button onClick={() => setImage("")}>Remove Image</Button>
                </>
              ) : (
                <input
                  type="file"
                  multiple={false}
                  onChange={handleImageUpload}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleFormSubmit}>
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

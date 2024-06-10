import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import Header from "../../components/Header";
import { addVehicle } from "../../utils/api_vehicles";
import { uploadImage } from "../../utils/api_images";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { getCategories } from "../../utils/api_categories";

export default function VehicleAddNew() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const { role } = currentUser;
  const { enqueueSnackbar } = useSnackbar();

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

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const addNewMutation = useMutation({
    mutationFn: addVehicle,
    onSuccess: () => {
      enqueueSnackbar("Vehicle added successfully", { variant: "success" });
      navigate("/");
    },
    onError: (e) => {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      enqueueSnackbar("Image uploaded successfully", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleImageUpload = (event) => {
    uploadImageMutation.mutate(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    addNewMutation.mutate({
      name: name,
      description: description,
      price: price,
      category: category,
      image: image,
      token: token,
    });
  };

  return (
    <>
      <Header />
      <Container>
        <Card sx={{ marginTop: "100px" }}>
          <CardContent>
            <Typography
              variant="h3"
              sx={{
                margin: "20px 0",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Add New Vehicle
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
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFormSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

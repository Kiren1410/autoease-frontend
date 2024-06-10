import Header from "../../components/Header";
import Carousel from "../../components/Carousel";
import GridList from "../../components/GridList";
import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../../utils/api_vehicles";
import { getCategories } from "../../utils/api_categories";
import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";

export default function Home() {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const { data: cards = [] } = useQuery({
    queryKey: ["vehicles", category, perPage, page],
    queryFn: () => {
      return getVehicles(category, perPage, page);
    },
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <>
      <Header />
      <Carousel />
      <Divider />
      <Box textAlign="center" sx={{ marginBottom: "15px" }}>
        <Typography variant="h5">Available Vehicles</Typography>
        <FormControl
          variant="standard"
          sx={{ minWidth: "150px", display: "inline-block", marginTop: "10px" }}
        >
          <Select
            labelId="category-label"
            id="category-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <GridList
        cards={cards}
        category={category}
        categories={categories}
        setCategory={setCategory}
        page={page}
        setPage={setPage}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
          padding: "20px 0",
        }}
      >
        <Button
          disabled={page === 1 ? true : false}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>Page: {page}</span>
        <Button
          disabled={cards.length < perPage ? true : false}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </>
  );
}

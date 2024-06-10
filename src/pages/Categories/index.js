import { useState } from "react";
import {
  Button,
  Typography,
  Container,
  TextField,
  Box,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import Header from "../../components/Header";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../utils/api_categories";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [name, setName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryID, setEditCategoryID] = useState("");
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

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      enqueueSnackbar("Added Category", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setName("");
    },
    onError: (e) => {
      enqueueSnackbar(e.response.data.message, {
        variant: "error",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      enqueueSnackbar("Updated Category", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // close modal
      setOpenEditModal(false);
    },

    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      enqueueSnackbar("Deleted Category", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    addCategoryMutation.mutate({
      name: name,
      token: token,
    });
  };

  console.log(categories);

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h5" gap={"5px"} sx={{ marginTop: "20px" }}>
          Add New Category
        </Typography>
        <Divider />
        <Box display="flex" sx={{ marginTop: "10px" }}>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            onClick={handleAddCategory}
            variant="contained"
            sx={{
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            Add
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "1200px", marginTop: "20px" }}
          align="center"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {categories.length > 0 ? (
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell align="left">{c.name}</TableCell>

                    <TableCell align="right">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          // open the edit modal
                          setOpenEditModal(true);
                          // set the edit category field to its name as value
                          setEditCategoryName(c.name);
                          // set the edit category id so that we know which category to update
                          setEditCategoryID(c._id);
                        }}
                        sx={{ marginRight: "10px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          const confirm = window.confirm("Delete Category?");
                          if (confirm) {
                            deleteCategoryMutation.mutate({
                              _id: c._id,
                              token: token,
                            });
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="h6">Categories</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              sx={{ width: "100%", marginTop: "15px" }}
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                updateCategoryMutation.mutate({
                  _id: editCategoryID,
                  name: editCategoryName,
                  token: token,
                });
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

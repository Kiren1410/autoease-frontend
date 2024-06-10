import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  TextField,
  Box, // Import Box component from MUI
} from "@mui/material";
import { useSnackbar } from "notistack";
import { signUpUser } from "../../utils/api_users";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      enqueueSnackbar("Successfully created account", { variant: "success" });
      navigate("/login");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleSignUp = () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      enqueueSnackbar("All fields are required", { variant: "error" });
    } else if (password !== confirmPassword) {
      enqueueSnackbar("Passwords must match", { variant: "error" });
    } else {
      signUpMutation.mutate({ name, email, password });
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url("https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                {" "}
                {/* Aligning the "Sign Up" title to center */}
                Sign Up
              </Typography>
              <TextField
                required
                fullWidth
                variant="outlined"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />
              <TextField
                required
                fullWidth
                variant="outlined"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />
              <TextField
                required
                fullWidth
                variant="outlined"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />
              <TextField
                required
                fullWidth
                variant="outlined"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSignUp}
                style={{ textTransform: "capitalize" }}
              >
                Sign Up
              </Button>
              <Box textAlign="center" mt={2}>
                {" "}
                {/* Centering the "Already have an account? Log in here" */}
                <Typography>
                  Already have an account?{" "}
                  <span
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "blue",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Log in here
                  </span>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
}

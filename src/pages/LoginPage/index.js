import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
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
import { useState } from "react";
import { useSnackbar } from "notistack";
import { loginUser } from "../../utils/api_users";
import { useCookies } from "react-cookie";

export default function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // save current logged-in user data into cookies
      setCookie("currentUser", data, {
        maxAge: 60 * 60 * 24 * 30, // 3600 * 24 = 24 hours * 7 = 1 month
      });
      // console.log(data);
      enqueueSnackbar("Successfully logged-in", { variant: "success" });
      // redirect to home page
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleLogin = () => {
    if (email === "" || password === "") {
      enqueueSnackbar("All fields are required", { variant: "danger" });
    } else {
      loginMutation.mutate({
        email,
        password,
      });
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
                {/* Aligning the word "Login" to center */}
                Login
              </Typography>
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
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                style={{ textTransform: "capitalize" }}
              >
                Login
              </Button>
              <Box textAlign="center" mt={2}>
                {" "}
                <Typography>
                  Don't Have An Account?{" "}
                  <span
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "blue",
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up Here
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

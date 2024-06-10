import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { emptyDetail } from "../../utils/api_detail";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Determine page title based on location
  let pageTitle = "AutoEase";
  if (location.pathname === "/bookings") {
    pageTitle = "My Bookings";
  } else if (location.pathname === "/login") {
    pageTitle = "Login to your Account";
  } else if (location.pathname === "/signup") {
    pageTitle = "Create a New Account";
  } else if (location.pathname === "/category") {
    pageTitle = "Create a New Account";
  }

  // Handle logout functionality
  const handleLogout = () => {
    removeCookie("currentUser"); // Remove current user cookie
    emptyDetail(); // Empty the cart
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1AABDB" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            {pageTitle}
          </Typography>

          {currentUser && (
            <Typography
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Welcome: {currentUser.name}
            </Typography>
          )}

          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => {
                navigate("/");
              }}
              sx={{ mr: 1 }}
              style={{
                color: location.pathname === "/" ? "white" : "inherit",
                backgroundColor:
                  location.pathname === "/" ? "#238be6" : "inherit",
              }}
            >
              Home
            </Button>
            {currentUser && currentUser.role === "admin" ? (
              <Button
                onClick={() => {
                  navigate("/bookings");
                }}
                sx={{ mr: 1 }}
                style={{
                  color:
                    location.pathname === "/all-bookings" ? "white" : "inherit",
                  backgroundColor:
                    location.pathname === "/all-bookings"
                      ? "#238be6"
                      : "inherit",
                }}
              >
                All Bookings
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate("/bookings");
                }}
                sx={{ mr: 1 }}
                style={{
                  color:
                    location.pathname === "/bookings" ? "white" : "inherit",
                  backgroundColor:
                    location.pathname === "/bookings" ? "#238be6" : "inherit",
                }}
              >
                My Bookings
              </Button>
            )}
            {currentUser && currentUser.role === "admin" && (
              <Button
                onClick={() => {
                  navigate("/dashboard");
                }}
                sx={{ mr: 1 }}
                style={{
                  color:
                    location.pathname === "/dashboard" ? "white" : "inherit",
                  backgroundColor:
                    location.pathname === "/dashboard" ? "#238be6" : "inherit",
                }}
              >
                Dashboard
              </Button>
            )}
            {currentUser ? (
              <Button onClick={handleLogout} sx={{ color: "white" }}>
                Log Out
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    navigate("/login");
                  }}
                  sx={{ mr: 1 }}
                  style={{
                    color: location.pathname === "/login" ? "white" : "inherit",
                    backgroundColor:
                      location.pathname === "/login" ? "#238be6" : "inherit",
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate("/signup");
                  }}
                  style={{
                    color:
                      location.pathname === "/signup" ? "white" : "inherit",
                    backgroundColor:
                      location.pathname === "/signup" ? "#238be6" : "inherit",
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <List>
          <ListItem button onClick={() => navigate("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => navigate("/bookings")}>
            <ListItemText primary="My Bookings" />
          </ListItem>
          {currentUser && currentUser.role === "admin" && (
            <ListItem button onClick={() => navigate("/dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
          )}
          {currentUser ? (
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <ListItem button onClick={() => navigate("/login")}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => navigate("/signup")}>
                <ListItemText primary="Signup" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}

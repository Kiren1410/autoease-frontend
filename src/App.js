import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import VehicleAddNew from "./pages/VehicleAddNew";
import VehicleEdit from "./pages/VehicleEdit";
import { SnackbarProvider } from "notistack";
import Detail from "./pages/Detail";
import Checkout from "./pages/CheckoutPage";
import Bookings from "./pages/Bookings";
import PaymentVerify from "./pages/PaymentVerify";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { CookiesProvider } from "react-cookie";
import CategoryPage from "./pages/Categories";
import Dashboard from "./pages/Dashboard";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "" }}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add" element={<VehicleAddNew />} />
              <Route path="/vehicles/:id" element={<VehicleEdit />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/verify-payment" element={<PaymentVerify />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/category" element={<CategoryPage />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}

export default App;

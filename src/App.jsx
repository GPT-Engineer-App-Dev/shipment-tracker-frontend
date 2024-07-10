import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home, Package, UserPlus, ClipboardList, LogIn } from "lucide-react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar";
import Index from "./pages/Index.jsx";
import TrackShipment from "./pages/TrackShipment.jsx";
import AddCustomer from "./pages/AddCustomer.jsx";
import ManageOrders from "./pages/ManageOrders.jsx";
import Login from "./pages/Login.jsx";
const queryClient = new QueryClient();

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Track Shipment",
    to: "/track",
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "Add Customer",
    to: "/add-customer",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    title: "Manage Orders",
    to: "/manage-orders",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  {
    title: "Login",
    to: "/login",
    icon: <LogIn className="h-4 w-4" />,
  },
];

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="/track" element={<TrackShipment />} />
              <Route path="/add-customer" element={<AddCustomer />} />
              <Route path="/manage-orders" element={<ManageOrders />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
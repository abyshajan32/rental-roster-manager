
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/NavBar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Rentals from "./pages/Rentals";
import Customers from "./pages/Customers";
import Workers from "./pages/Workers";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <AuthGuard>
                      <Inventory />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/rentals"
                  element={
                    <AuthGuard>
                      <Rentals />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <AuthGuard>
                      <Customers />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/workers"
                  element={
                    <AuthGuard>
                      <Workers />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <AuthGuard>
                      <Reports />
                    </AuthGuard>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AuthGuard>
                <NavBar />
              </AuthGuard>
            </div>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

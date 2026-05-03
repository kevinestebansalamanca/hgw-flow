import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Catalogo from "./pages/Catalogo.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminReset from "./pages/admin/AdminReset.tsx";
import { AdminLayout } from "./pages/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import ProductsList from "./pages/admin/ProductsList.tsx";
import ProductForm from "./pages/admin/ProductForm.tsx";
import Trash from "./pages/admin/Trash.tsx";
import Security from "./pages/admin/Security.tsx";
import HistoryPage from "./pages/admin/HistoryPage.tsx";
import Contact from "./pages/admin/Contact.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/reset" element={<AdminReset />} />
            <Route path="/admin/panel" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<ProductsList />} />
              <Route path="productos/nuevo" element={<ProductForm />} />
              <Route path="productos/:id" element={<ProductForm />} />
              <Route path="papelera" element={<Trash />} />
              <Route path="seguridad" element={<Security />} />
              <Route path="historial" element={<HistoryPage />} />
              <Route path="contacto" element={<Contact />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

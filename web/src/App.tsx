import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shipper from "./pages/Shipper";
import MissionDetail from "./pages/MissionDetail";
import Courier from "./pages/Courier";
import Receiver from "./pages/Receiver";
import Ops from "./pages/Ops";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shipper" element={<Shipper />} />
          <Route path="/courier" element={<Courier />} />
          <Route path="/receiver/:id" element={<Receiver />} />
          <Route path="/ops" element={<Ops />} />
          <Route path="/mission/:id" element={<MissionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

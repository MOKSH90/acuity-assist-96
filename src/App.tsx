import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage, LoginPage } from "@/components/LandingPage";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import AddPatient from "./pages/AddPatient";
import PatientQueue from "./pages/PatientQueue";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage onLogin={() => setIsAuthenticated(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4">
                  <SidebarTrigger />
                  <div className="ml-4">
                    <h2 className="font-semibold text-foreground">Emergency Department</h2>
                    <p className="text-xs text-muted-foreground">Real-time patient triage system</p>
                  </div>
                </header>
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/patients/new" element={<AddPatient />} />
                    <Route path="/patients/queue" element={<PatientQueue />} />
                    <Route path="/patients/:id" element={<div className="p-6"><h1>Patient Details (Coming Soon)</h1></div>} />
                    <Route path="/patients" element={<div className="p-6"><h1>All Patients (Coming Soon)</h1></div>} />
                    <Route path="/beds" element={<div className="p-6"><h1>Bed Management (Coming Soon)</h1></div>} />
                    <Route path="/feedback" element={<div className="p-6"><h1>Doctor Feedback (Coming Soon)</h1></div>} />
                    <Route path="/model" element={<div className="p-6"><h1>Analytics (Coming Soon)</h1></div>} />
                    <Route path="/settings" element={<div className="p-6"><h1>Settings (Coming Soon)</h1></div>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

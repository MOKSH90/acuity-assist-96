import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "@/components/LandingPage";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import StaffManagement from "./pages/StaffManagement";
import AllPatients from "./pages/AllPatients";
import BedManagement from "./pages/BedManagement";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import AddPatient from "./pages/AddPatient";
import PatientQueue from "./pages/PatientQueue";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, login } = useAuth();

 if (!user) {
   return (
     <LoginPage
       onLogin={async (email: string, password: string) => {
         const success = await login(email, password);
         if (!success) {
           console.error("Login failed");
         }
       }}
     />
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
                    <Route path="/patients" element={<AllPatients />} />
                    <Route path="/patients/:id" element={<div className="p-6"><h1>Patient Details (Coming Soon)</h1></div>} />
                    <Route path="/beds" element={<BedManagement />} />
                    <Route path="/staff" element={<StaffManagement />} />
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

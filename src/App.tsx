
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ResumeProvider } from "@/context/ResumeContext";
import Welcome from "./pages/Welcome";
import TemplateSelection from "./pages/TemplateSelection";
import PersonalDetails from "./pages/PersonalDetails";
import Education from "./pages/Education";
import WorkExperience from "./pages/WorkExperience";
import Preview from "./pages/Preview";
import Account from "./pages/Account";
import ResumePreview from "./pages/ResumePreview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ResumeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/template" element={<TemplateSelection />} />
            <Route path="/personal-details" element={<PersonalDetails />} />
            <Route path="/education" element={<Education />} />
            <Route path="/work-experience" element={<WorkExperience />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/resume-preview" element={<ResumePreview />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ResumeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

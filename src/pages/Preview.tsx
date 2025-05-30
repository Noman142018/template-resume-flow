import { useRef, useState } from 'react';
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Download, Eye, Save } from "lucide-react";
import { usePDF } from 'react-to-pdf';
import { colorPalettes, resumeTemplates } from '@/context/ResumeContext';
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AuthForm from '@/components/auth/AuthForm';
import ResumeTemplate from '@/components/resume-templates/ResumeTemplate';

export default function Preview() {
  const { resumeData, updateTemplate } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toPDF, targetRef } = usePDF({
    filename: `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
    method: 'save',
    page: {
      format: 'a4',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: "image/png",
    },
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Get selected template and color palette for display
  const selectedTemplate = resumeTemplates.find(t => t.id === resumeData.selectedTemplate) || resumeTemplates[0];
  const selectedPalette = colorPalettes.find(p => p.id === resumeData.selectedColorPalette) || colorPalettes[0];
  
  // Check for authenticated user
  useState(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  });

  // Switch between templates
  const switchTemplate = () => {
    navigate('/template');
  };

  // Open resume in new tab with improved data handling
  const handleOpenPreview = () => {
    try {
      // Ensure the data is a valid JSON string
      const jsonData = JSON.stringify(resumeData);
      console.log("Storing resume data in session storage", jsonData.length, "bytes");
      
      // Store resume data in session storage for the preview page
      sessionStorage.setItem('previewResumeData', jsonData);
      
      // Open the preview in a new tab
      window.open('/resume-preview', '_blank');
    } catch (error) {
      console.error("Error preparing resume preview:", error);
      toast({
        variant: "destructive",
        title: "Error opening preview",
        description: "Failed to prepare your resume preview. Please try again.",
      });
    }
  };

  // Handle download request with improved PDF generation
  const handleDownload = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    try {
      console.log("Generating PDF document");
      toPDF();
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Error",
        description: "Failed to generate your PDF. Please try again.",
      });
    }
  };

  // Save resume to database
  const saveResume = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('resumes').insert({
        user_id: user.id,
        data: resumeData,
        name: resumeData.personalDetails.fullName 
          ? `${resumeData.personalDetails.fullName}'s Resume`
          : 'My Resume'
      });
      
      if (error) throw error;
      
      toast({
        title: "Resume saved!",
        description: "Your resume has been saved to your account.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving resume",
        description: error.message || "Failed to save your resume. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle successful auth
  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    toast({
      title: "Authentication successful!",
      description: "You can now download or save your resume.",
    });
  };

  return (
    <ResumeBuilderLayout
      title="Finalize Your Resume"
      subTitle="Preview, save or download your resume as a PDF."
    >
      <div className="space-y-6">
        {/* Resume Information */}
        <div className="p-4 md:p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Template</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded overflow-hidden mr-2 border">
                  <img 
                    src={selectedTemplate.thumbnail || `/placeholder.svg`} 
                    alt={selectedTemplate.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{selectedTemplate.name}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Color Palette</h3>
              <div className="flex items-center">
                <div className="flex w-10 h-10 rounded overflow-hidden mr-2 border">
                  <div className="w-1/3 h-full" style={{ backgroundColor: selectedPalette.primary }}></div>
                  <div className="w-1/3 h-full" style={{ backgroundColor: selectedPalette.secondary }}></div>
                  <div className="w-1/3 h-full" style={{ backgroundColor: selectedPalette.accent }}></div>
                </div>
                <span>{selectedPalette.name}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons with improved styling */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button 
              onClick={switchTemplate}
              className="font-medium border-2 border-black py-2 px-5 bg-black text-white hover:bg-gray-800"
            >
              Change Template
            </Button>

            <Button 
              onClick={saveResume}
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Resume'}
            </Button>
          </div>
        </div>
        
        {/* Main Action Buttons */}
        <div className="flex flex-col space-y-4">
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-4">Resume Actions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Preview Your Resume</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Click the button below to open your resume in a new tab for full-page preview with zoom functionality.
                </p>
                <Button
                  onClick={handleOpenPreview}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" /> Preview Resume
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Download As PDF</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Generate and download your resume as a PDF file. You'll need to sign in first if you haven't already.
                </p>
                <Button 
                  onClick={handleDownload}
                  variant="default"
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
          
          {/* Hidden div for PDF generation at full A4 size */}
          <div className="hidden">
            <div ref={targetRef} className="w-[210mm] h-[297mm]">
              <ResumeTemplate resumeData={resumeData} ref={resumeRef} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please sign in or create an account to download or save your resume.
            </DialogDescription>
          </DialogHeader>
          
          <Separator className="my-4" />
          
          <AuthForm onAuthSuccess={handleAuthSuccess} />
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <NavigationButtons prevPath="/work-experience" />
    </ResumeBuilderLayout>
  );
}

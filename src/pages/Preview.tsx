
import { useRef, useEffect, useState } from 'react';
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Save, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import ResumeTemplate from '@/components/resume-templates/ResumeTemplate';
import { usePDF } from 'react-to-pdf';
import { colorPalettes, resumeTemplates } from '@/context/ResumeContext';
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import AuthForm from '@/components/auth/AuthForm';

export default function Preview() {
  const { resumeData, updateTemplate } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const { toPDF, targetRef } = usePDF({
    filename: `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
    method: 'save',
    page: {
      format: 'a4',
      orientation: 'portrait',
    },
    canvas: {
      // PDF quality settings
      dpi: 300,
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
  useEffect(() => {
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
  }, []);

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 40));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Switch between templates
  const switchTemplate = () => {
    const newTemplateId = resumeData.selectedTemplate === 'classic' ? 'modern' : 'classic';
    updateTemplate(newTemplateId);
  };

  // Handle download request
  const handleDownload = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    toPDF();
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
      title="Preview & Download"
      subTitle="Review your resume and download a PDF copy."
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

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between">
            <Button 
              onClick={switchTemplate}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Change Template
            </Button>

            <Button 
              onClick={saveResume}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Resume'}
            </Button>
          </div>
        </div>
        
        {/* Resume Preview Wrapper with A4 dimensions and zoom controls */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gray-100 border-b p-4 flex justify-between items-center">
            <h3 className="font-medium">Resume Preview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-8 px-2 rounded-none border-r"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm font-medium">{zoomLevel}%</span>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-8 px-2 rounded-none border-l"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="h-8 px-2"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          
          {/* Enhanced resume preview container with proper A4 sizing and zoom */}
          <div className="flex justify-center p-6 bg-gray-50 overflow-auto" style={{ minHeight: "500px" }}>
            <div 
              className="bg-white shadow-sm transition-transform origin-top"
              style={{
                width: '210mm', // A4 width
                height: '297mm', // A4 height
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <div 
                className="h-full w-full" 
                ref={targetRef}
                style={{ overflow: 'hidden' }}
              >
                <ResumeTemplate resumeData={resumeData} ref={resumeRef} />
              </div>
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

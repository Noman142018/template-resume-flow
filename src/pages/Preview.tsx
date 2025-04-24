
import { useRef } from 'react';
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import ResumeTemplate from '@/components/resume-templates/ResumeTemplate';
import { usePDF } from 'react-to-pdf';
import { colorPalettes, resumeTemplates } from '@/context/ResumeContext';
import { useNavigate } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Preview() {
  const { resumeData, updateTemplate } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toPDF, targetRef } = usePDF({filename: `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`});
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get selected template and color palette for display
  const selectedTemplate = resumeTemplates.find(t => t.id === resumeData.selectedTemplate) || resumeTemplates[0];
  const selectedPalette = colorPalettes.find(p => p.id === resumeData.selectedColorPalette) || colorPalettes[0];
  
  // Switch between templates
  const switchTemplate = () => {
    const newTemplateId = resumeData.selectedTemplate === 'classic' ? 'modern' : 'classic';
    updateTemplate(newTemplateId);
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
          
          {/* Change Template Button */}
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={switchTemplate}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Change Template
            </Button>
          </div>
        </div>
        
        {/* Resume Preview Wrapper */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gray-100 border-b p-4 flex justify-between items-center">
            <h3 className="font-medium">Resume Preview</h3>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => toPDF()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
          
          {/* The actual resume preview - Mobile friendly container */}
          <div className="flex justify-center p-2 md:p-4 bg-gray-50 overflow-hidden">
            <div 
              className={`w-full max-w-[800px] bg-white shadow-sm ${
                isMobile ? 'transform-none' : 'aspect-[210/297]'
              }`}
              style={{
                height: isMobile ? 'auto' : undefined,
                transform: isMobile ? 'none' : undefined,
              }}
            >
              <div className="h-full">
                <ResumeTemplate ref={targetRef} resumeData={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <NavigationButtons prevPath="/work-experience" />
    </ResumeBuilderLayout>
  );
}

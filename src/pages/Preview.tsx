
import { useRef } from 'react';
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ResumeTemplate from '@/components/resume-templates/ResumeTemplate';
import { usePDF } from 'react-to-pdf';
import { colorPalettes, resumeTemplates } from '@/context/ResumeContext';

export default function Preview() {
  const { resumeData } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toPDF, targetRef } = usePDF({filename: `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`});
  
  // Get selected template and color palette for display
  const selectedTemplate = resumeTemplates.find(t => t.id === resumeData.selectedTemplate) || resumeTemplates[0];
  const selectedPalette = colorPalettes.find(p => p.id === resumeData.selectedColorPalette) || colorPalettes[0];

  return (
    <ResumeBuilderLayout
      title="Preview & Download"
      subTitle="Review your resume and download a PDF copy."
    >
      <div className="space-y-8">
        {/* Resume Information */}
        <div className="p-6 bg-gray-50 rounded-lg">
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
        </div>
        
        {/* Resume Preview Wrapper */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gray-100 border-b p-4 flex justify-between items-center">
            <h3 className="font-medium">Resume Preview</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => toPDF()}
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
          
          {/* The actual resume preview */}
          <div className="flex justify-center p-4 bg-gray-50">
            <div className="w-full max-w-[800px] aspect-[210/297] border shadow-sm bg-white">
              <div className="h-full overflow-auto">
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

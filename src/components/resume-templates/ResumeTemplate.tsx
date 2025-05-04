
import React, { forwardRef } from 'react';
import { ResumeData } from '@/types/resume';
import { colorPalettes } from '@/context/ResumeContext';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';

interface ResumeTemplateProps {
  resumeData: ResumeData;
}

const ResumeTemplate = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ resumeData }, ref) => {
    // Get the selected color palette
    const selectedPalette = colorPalettes.find(
      (palette) => palette.id === resumeData.selectedColorPalette
    ) || colorPalettes[0];

    // Render the selected template
    const renderTemplate = () => {
      switch (resumeData.selectedTemplate) {
        case 'modern':
          return <ModernTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
        case 'classic':
        default:
          return <ClassicTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
      }
    };

    // Ensure we have valid data before rendering
    if (!resumeData || !resumeData.personalDetails) {
      console.error("Invalid resume data provided to ResumeTemplate", resumeData);
      return (
        <div ref={ref} className="resume-error p-4 text-center">
          <p>Error: Invalid resume data</p>
        </div>
      );
    }

    return (
      <div 
        ref={ref} 
        className="resume-template-container w-full h-full"
        style={{ 
          pageBreakInside: 'avoid',
          boxSizing: 'border-box',
          backgroundColor: 'white',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {renderTemplate()}
      </div>
    );
  }
);

ResumeTemplate.displayName = 'ResumeTemplate';

export default ResumeTemplate;

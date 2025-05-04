
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

    return (
      <div 
        ref={ref} 
        className="resume-template-container w-full h-full"
        style={{ 
          pageBreakInside: 'avoid',
          boxSizing: 'border-box',
          overflow: 'hidden',
          backgroundColor: 'white',
          position: 'relative',
          // These ensure PDF generation uses full A4 dimensions
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

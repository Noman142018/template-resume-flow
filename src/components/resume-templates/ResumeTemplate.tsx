
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
        case 'classic':
          return <ClassicTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
        case 'modern':
          return <ModernTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
        // For simplicity in this demo, we'll use the existing templates for all types
        case 'minimal':
        case 'professional':
        case 'executive':
        case 'creative':
          return <ClassicTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
        case 'elegant':
        case 'corporate':
        case 'bold':
        case 'simple':
          return <ModernTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
        default:
          return <ClassicTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
      }
    };

    return (
      <div ref={ref} className="resume-template-container">
        {renderTemplate()}
      </div>
    );
  }
);

ResumeTemplate.displayName = 'ResumeTemplate';

export default ResumeTemplate;

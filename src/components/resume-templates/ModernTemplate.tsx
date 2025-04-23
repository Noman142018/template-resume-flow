
import React from 'react';
import { ResumeData, ColorPalette } from '@/types/resume';

interface ModernTemplateProps {
  resumeData: ResumeData;
  colorPalette: ColorPalette;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resumeData, colorPalette }) => {
  const { personalDetails, education, workExperience, skills } = resumeData;

  return (
    <div className="w-full h-full font-sans">
      {/* Header */}
      <header 
        className="p-8"
        style={{ backgroundColor: colorPalette.primary, color: colorPalette.primary === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{personalDetails.fullName}</h1>
            <div className="text-sm opacity-90">{personalDetails.email} • {personalDetails.phone}</div>
            {personalDetails.linkedin && (
              <div className="text-sm opacity-90">{personalDetails.linkedin}</div>
            )}
            <div className="text-sm opacity-90">{personalDetails.address}</div>
          </div>
          
          {personalDetails.profilePicture && (
            <div className="hidden md:block">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white">
                <img 
                  src={personalDetails.profilePicture} 
                  alt={personalDetails.fullName}
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          )}
        </div>
        
        {personalDetails.summary && (
          <p className="mt-6 max-w-2xl">{personalDetails.summary}</p>
        )}
      </header>

      <div className="grid grid-cols-3 gap-0">
        {/* Left Sidebar */}
        <div 
          className="col-span-1 p-6"
          style={{ backgroundColor: colorPalette.secondary + '20', color: colorPalette.text }}
        >
          {/* Skills Section */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 
                className="text-xl font-semibold mb-4 pb-2 border-b"
                style={{ borderColor: colorPalette.primary, color: colorPalette.primary }}
              >
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div 
                    key={skill.id}
                    className="py-1 px-3 rounded-md text-sm inline-block mr-2 mb-2"
                    style={{ 
                      backgroundColor: colorPalette.primary + '20',
                      color: colorPalette.primary
                    }}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <section>
              <h2 
                className="text-xl font-semibold mb-4 pb-2 border-b"
                style={{ borderColor: colorPalette.primary, color: colorPalette.primary }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <div className="text-sm font-medium">{edu.institution}</div>
                    <div className="text-sm">{edu.fieldOfStudy}</div>
                    <div className="text-xs mt-1 opacity-75">
                      {edu.startDate && (
                        <>
                          {new Date(edu.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short' 
                          })}
                          {' - '}
                          {edu.endDate 
                            ? new Date(edu.endDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short' 
                            })
                            : 'Present'
                          }
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content Area */}
        <div className="col-span-2 p-6" style={{ backgroundColor: colorPalette.background, color: colorPalette.text }}>
          {/* Work Experience Section */}
          {workExperience.length > 0 && (
            <section>
              <h2 
                className="text-xl font-semibold mb-6 pb-2 border-b"
                style={{ borderColor: colorPalette.primary, color: colorPalette.primary }}
              >
                Work Experience
              </h2>
              <div className="space-y-6">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                      <div>
                        <h3 className="text-lg font-medium">{exp.jobTitle}</h3>
                        <div className="font-medium opacity-75">{exp.company}</div>
                      </div>
                      <div className="text-sm opacity-75">
                        {exp.startDate && (
                          <>
                            {new Date(exp.startDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short' 
                            })}
                            {' - '}
                            {exp.endDate 
                              ? new Date(exp.endDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short' 
                              })
                              : 'Present'
                            }
                          </>
                        )}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-2 whitespace-pre-line text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;

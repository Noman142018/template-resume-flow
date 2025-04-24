
import React from 'react';
import { ResumeData, ColorPalette } from '@/types/resume';

interface ModernTemplateProps {
  resumeData: ResumeData;
  colorPalette: ColorPalette;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resumeData, colorPalette }) => {
  const { personalDetails, education, workExperience, skills } = resumeData;

  return (
    <div className="w-full h-full font-sans flex flex-col">
      {/* Header */}
      <header 
        className="p-6 md:p-8 flex flex-col md:flex-row gap-4 items-start"
        style={{ backgroundColor: colorPalette.primary, color: colorPalette.primary === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
      >
        {/* Profile Picture - Top Left */}
        {personalDetails.profilePicture && (
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white">
              <img 
                src={personalDetails.profilePicture} 
                alt={personalDetails.fullName}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}

        <div className="flex-grow">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{personalDetails.fullName}</h1>
          <div className="text-sm opacity-90 flex flex-col md:flex-row md:gap-3 flex-wrap">
            {personalDetails.email && (
              <div>{personalDetails.email}</div>
            )}
            {personalDetails.phone && (
              <div>{personalDetails.phone}</div>
            )}
            {personalDetails.address && (
              <div>{personalDetails.address}</div>
            )}
            {personalDetails.linkedin && (
              <div>{personalDetails.linkedin}</div>
            )}
          </div>
          
          {personalDetails.summary && (
            <p className="mt-3 text-sm">{personalDetails.summary}</p>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left Sidebar */}
        <div 
          className="w-full md:w-1/3 p-5 md:p-6"
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
              <div className="flex flex-wrap gap-2">
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
        <div className="w-full md:w-2/3 p-5 md:p-6" style={{ backgroundColor: colorPalette.background, color: colorPalette.text }}>
          {/* Work Experience Section */}
          {workExperience.length > 0 && (
            <section>
              <h2 
                className="text-xl font-semibold mb-6 pb-2 border-b"
                style={{ borderColor: colorPalette.primary, color: colorPalette.primary }}
              >
                Work Experience
              </h2>
              <div className="space-y-5">
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

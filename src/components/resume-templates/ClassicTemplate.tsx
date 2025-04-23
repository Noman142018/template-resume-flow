
import React from 'react';
import { ResumeData, ColorPalette } from '@/types/resume';

interface ClassicTemplateProps {
  resumeData: ResumeData;
  colorPalette: ColorPalette;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ resumeData, colorPalette }) => {
  const { personalDetails, education, workExperience, skills } = resumeData;

  return (
    <div 
      className="w-full h-full p-8 font-sans"
      style={{
        backgroundColor: colorPalette.background,
        color: colorPalette.text,
      }}
    >
      {/* Header */}
      <header className="mb-6 pb-6 border-b" style={{ borderColor: colorPalette.primary }}>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: colorPalette.primary }}
        >
          {personalDetails.fullName}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm">
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
          <p className="mt-4 text-sm">{personalDetails.summary}</p>
        )}
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {/* Education Section */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2 
                className="text-xl font-semibold mb-3"
                style={{ color: colorPalette.primary }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{edu.degree}</h3>
                      <div className="text-sm">
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
                    <div>{edu.institution}</div>
                    <div className="text-sm">{edu.fieldOfStudy}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience Section */}
          {workExperience.length > 0 && (
            <section className="mb-6">
              <h2 
                className="text-xl font-semibold mb-3"
                style={{ color: colorPalette.primary }}
              >
                Work Experience
              </h2>
              <div className="space-y-6">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{exp.jobTitle}</h3>
                      <div className="text-sm">
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
                    <div className="font-medium">{exp.company}</div>
                    {exp.description && (
                      <p className="text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-full md:w-1/3">
          {/* Profile Picture */}
          {personalDetails.profilePicture && (
            <div className="mb-6 flex justify-center">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4" 
                style={{ borderColor: colorPalette.primary }}
              >
                <img 
                  src={personalDetails.profilePicture} 
                  alt={personalDetails.fullName}
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          )}
          
          {/* Skills Section */}
          {skills.length > 0 && (
            <section className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colorPalette.accent + '30' }}>
              <h2 
                className="text-xl font-semibold mb-3"
                style={{ color: colorPalette.primary }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: colorPalette.secondary,
                      color: colorPalette.background
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;

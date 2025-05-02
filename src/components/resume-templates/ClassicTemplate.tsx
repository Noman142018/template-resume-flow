
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
      className="w-full h-full p-6 md:p-8 font-sans flex flex-col"
      style={{
        backgroundColor: colorPalette.background,
        color: colorPalette.text,
      }}
    >
      {/* Header */}
      <header className="mb-6 pb-4 border-b flex flex-col items-center" style={{ borderColor: colorPalette.primary }}>
        {/* Profile Picture - Centered */}
        {personalDetails.profilePicture && (
          <div className="mb-4">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4" 
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
        
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2 text-center"
          style={{ color: colorPalette.primary }}
        >
          {personalDetails.fullName}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3 text-sm">
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
          <p className="mt-4 text-sm text-center max-w-2xl mx-auto">{personalDetails.summary}</p>
        )}
      </header>

      {/* Main Content - Two column grid */}
      <div className="flex-grow grid md:grid-cols-2 gap-6 print:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Education Section */}
          {education.length > 0 && (
            <section>
              <h2 
                className="text-xl font-semibold mb-3 pb-1 border-b"
                style={{ color: colorPalette.primary, borderColor: colorPalette.primary + '50' }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
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

          {/* Skills Section */}
          {skills.length > 0 && (
            <section>
              <h2 
                className="text-xl font-semibold mb-3 pb-1 border-b"
                style={{ color: colorPalette.primary, borderColor: colorPalette.primary + '50' }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-sm print:inline-block print:mr-2 print:mb-2"
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Work Experience Section */}
          {workExperience.length > 0 && (
            <section>
              <h2 
                className="text-xl font-semibold mb-3 pb-1 border-b"
                style={{ color: colorPalette.primary, borderColor: colorPalette.primary + '50' }}
              >
                Work Experience
              </h2>
              <div className="space-y-5">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
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
      </div>

      <style>
        {`
        @media print {
          .print\\:grid-cols-2 {
            grid-template-columns: 1fr 1fr;
          }
          .print\\:block {
            display: block;
          }
          .print\\:flex {
            display: flex;
          }
          .print\\:flex-wrap {
            flex-wrap: wrap;
          }
          .print\\:inline-block {
            display: inline-block;
          }
          .print\\:mr-2 {
            margin-right: 0.5rem;
          }
          .print\\:mb-2 {
            margin-bottom: 0.5rem;
          }
          .print\\:mb-3 {
            margin-bottom: 0.75rem;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          .print\\:justify-between {
            justify-content: space-between;
          }
        }
        `}
      </style>
    </div>
  );
};

export default ClassicTemplate;

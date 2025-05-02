
import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ColorPalette, Education, PersonalDetails, ResumeData, ResumeTemplate, Skill, WorkExperience } from '@/types/resume';

// Resume Templates - Reduced to just two templates
export const resumeTemplates: ResumeTemplate[] = [
  { id: 'classic', name: 'Classic (Single Column)', thumbnail: '/templates/classic-thumb.png', previewImage: '/templates/classic-preview.png' },
  { id: 'modern', name: 'Modern (Two Column)', thumbnail: '/templates/modern-thumb.png', previewImage: '/templates/modern-preview.png' },
];

// Color Palettes
export const colorPalettes: ColorPalette[] = [
  { id: 'blue', name: 'Professional Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#93C5FD', background: '#F8FAFC', text: '#1E293B' },
  { id: 'green', name: 'Forest Green', primary: '#166534', secondary: '#22C55E', accent: '#86EFAC', background: '#F0FDF4', text: '#14532D' },
  { id: 'purple', name: 'Royal Purple', primary: '#6B21A8', secondary: '#A855F7', accent: '#D8B4FE', background: '#FAF5FF', text: '#581C87' },
  { id: 'red', name: 'Ruby Red', primary: '#9F1239', secondary: '#F43F5E', accent: '#FDA4AF', background: '#FFF1F2', text: '#881337' },
  { id: 'gray', name: 'Professional Gray', primary: '#334155', secondary: '#64748B', accent: '#CBD5E1', background: '#F8FAFC', text: '#0F172A' },
  { id: 'teal', name: 'Teal', primary: '#115E59', secondary: '#14B8A6', accent: '#5EEAD4', background: '#F0FDFA', text: '#134E4A' },
];

// Default Values
const defaultPersonalDetails: PersonalDetails = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  profilePicture: '',
  summary: '',
};

const defaultResumeData: ResumeData = {
  selectedTemplate: 'classic',
  selectedColorPalette: 'blue',
  personalDetails: defaultPersonalDetails,
  education: [],
  workExperience: [],
  skills: [],
};

type ResumeContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resumeData: ResumeData;
  updatePersonalDetails: (details: PersonalDetails) => void;
  addEducation: () => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, workExperience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;
  updateTemplate: (templateId: string) => void;
  updateColorPalette: (paletteId: string) => void;
  updateState: (state: ResumeData) => void; // New function to update entire state
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);

  const updatePersonalDetails = (details: Partial<PersonalDetails>) => {
    setResumeData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...details },
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      degree: '',
      fieldOfStudy: '',
      institution: '',
      startDate: '',
      endDate: '',
    };

    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addWorkExperience = () => {
    const newWorkExperience: WorkExperience = {
      id: uuidv4(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    };

    setResumeData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newWorkExperience],
    }));
  };

  const updateWorkExperience = (id: string, workExperience: Partial<WorkExperience>) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...workExperience } : exp
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  const addSkill = (name: string) => {
    const newSkill: Skill = {
      id: uuidv4(),
      name,
    };

    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const updateTemplate = (templateId: string) => {
    setResumeData((prev) => ({
      ...prev,
      selectedTemplate: templateId,
    }));
  };

  const updateColorPalette = (paletteId: string) => {
    setResumeData((prev) => ({
      ...prev,
      selectedColorPalette: paletteId,
    }));
  };

  // New function to update entire state (for loading saved resumes)
  const updateState = (state: ResumeData) => {
    setResumeData(state);
  };

  return (
    <ResumeContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        resumeData,
        updatePersonalDetails,
        addEducation,
        updateEducation,
        removeEducation,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addSkill,
        removeSkill,
        updateTemplate,
        updateColorPalette,
        updateState,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

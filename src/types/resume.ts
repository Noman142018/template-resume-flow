
export type ResumeTemplate = {
  id: string;
  name: string;
  thumbnail: string;
  previewImage: string;
};

export type ColorPalette = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type Education = {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate: string;
  endDate: string;
};

export type WorkExperience = {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type PersonalDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  profilePicture?: string;
  summary?: string;
};

export type Skill = {
  id: string;
  name: string;
};

export type ResumeData = {
  selectedTemplate: string;
  selectedColorPalette: string;
  personalDetails: PersonalDetails;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
};

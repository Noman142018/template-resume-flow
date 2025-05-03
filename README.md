# Resume Builder Application

This project is a resume builder application that allows users to create professional resumes by filling out their personal details, education history, work experience, and skills. Users can choose between different templates and color schemes, preview their resume, and download it as a PDF.

## Application Workflow

1. **Welcome Screen**: Introduction to the resume builder
2. **Template Selection**: Choose a resume template and color scheme
3. **Personal Details**: Enter name, contact information, and profile picture
4. **Education**: Add educational background and qualifications
5. **Work Experience**: Add professional experience and job descriptions
6. **Preview & Download**: Preview the resume and download it as a PDF

## Resume Templates Explained

The application currently offers two templates:

### 1. Classic Template (One-Column)
A traditional resume layout with all sections arranged in a single column. The profile picture and name are centered at the top, followed by contact information, and then educational and professional details.

```jsx
// ClassicTemplate.tsx
// This file renders a single-column resume layout with:
// - Centered header with profile picture and personal details
// - Two-column grid for education and work experience sections
```

#### Key styling features:
- `border-radius: 50%` - Creates circular profile pictures
- `border: 4px solid #colorvalue` - Adds a thick border around the profile picture
- `text-align: center` - Centers header content
- `grid-template-columns: 1fr 1fr` - Creates two-column grid layout for content sections

### 2. Modern Template (Two-Column)
A contemporary layout that divides the resume into two distinct columns. Personal details and skills are placed in a sidebar on the left, while education and work experience occupy the main content area on the right.

```jsx
// ModernTemplate.tsx
// This file renders a two-column resume layout with:
// - Left sidebar (1/3 width) containing profile picture, skills and education
// - Main content area (2/3 width) containing work experience
```

#### Key styling features:
- `flex` - Creates the two-column layout structure
- `w-full md:w-1/3` and `w-full md:w-2/3` - Defines column widths (1/3 and 2/3)
- `backgroundColor: colorPalette.primary` - Applies the selected color to the header
- `backgroundColor: colorPalette.secondary + '20'` - Creates a lighter shade for the sidebar

## How to Modify Resume Templates

### Changing Styling

#### Font Sizes
```css
/* To change the heading font size */
.text-2xl {
  font-size: 1.5rem; /* Increase or decrease as needed */
}

/* To change the body text size */
.text-sm {
  font-size: 0.875rem; /* Adjust as needed */
}
```

#### Colors
The application uses color palettes that can be modified in the `ResumeContext.tsx` file:
```jsx
// To add a new color palette, add an entry to the colorPalettes array:
{
  id: 'newPalette',
  name: 'New Palette Name',
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  accent: '#your-accent-color',
  background: '#your-background-color',
  text: '#your-text-color'
}
```

#### Spacing
```css
/* To adjust spacing between sections */
.mb-6 {
  margin-bottom: 1.5rem; /* Adjust as needed */
}

/* To adjust padding within sections */
.p-6 {
  padding: 1.5rem; /* Adjust as needed */
}
```

### Modifying Layouts

#### Classic Template
To adjust the column widths in the two-column grid:
```jsx
// Change this:
<div className="flex-grow grid md:grid-cols-2 gap-6 print:grid-cols-2">

// To have uneven columns (e.g., 40/60 split):
<div className="flex-grow grid md:grid-cols-[40%_60%] gap-6 print:grid-cols-[40%_60%]">
```

#### Modern Template
To adjust the sidebar width:
```jsx
// Change these values:
<div className="w-full md:w-1/3 p-5 md:p-6 print:w-1/3">
<div className="w-full md:w-2/3 p-5 md:p-6 flex-grow print:w-2/3">

// For example, to make a 40/60 split:
<div className="w-full md:w-2/5 p-5 md:p-6 print:w-2/5">
<div className="w-full md:w-3/5 p-5 md:p-6 flex-grow print:w-3/5">
```

## Adding a New Template

To add a new template to the application:

1. **Create a new template component file**:
   ```jsx
   // src/components/resume-templates/NewTemplate.tsx
   import React from 'react';
   import { ResumeData, ColorPalette } from '@/types/resume';
   
   interface NewTemplateProps {
     resumeData: ResumeData;
     colorPalette: ColorPalette;
   }
   
   const NewTemplate: React.FC<NewTemplateProps> = ({ resumeData, colorPalette }) => {
     const { personalDetails, education, workExperience, skills } = resumeData;
     
     return (
       <div className="w-full h-full font-sans">
         {/* Your template structure here */}
         {/* Header */}
         <header>
           {/* Header content */}
         </header>
         
         {/* Main content */}
         <main>
           {/* Resume sections */}
         </main>
       </div>
     );
   };
   
   export default NewTemplate;
   ```

2. **Add the template to the templates list in `ResumeContext.tsx`**:
   ```jsx
   export const resumeTemplates = [
     // Existing templates
     {
       id: 'classic',
       name: 'Classic',
       thumbnail: '/templates/classic-thumb.png',
       previewImage: '/templates/classic-preview.png'
     },
     {
       id: 'modern',
       name: 'Modern',
       thumbnail: '/templates/modern-thumb.png',
       previewImage: '/templates/modern-preview.png'
     },
     // Add your new template
     {
       id: 'newTemplate',
       name: 'New Template Name',
       thumbnail: '/templates/new-template-thumb.png',
       previewImage: '/templates/new-template-preview.png'
     }
   ];
   ```

3. **Update the template renderer in `ResumeTemplate.tsx`**:
   ```jsx
   import NewTemplate from './NewTemplate';
   
   // Inside the renderTemplate function:
   const renderTemplate = () => {
     switch (resumeData.selectedTemplate) {
       case 'modern':
         return <ModernTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
       case 'newTemplate':
         return <NewTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
       case 'classic':
       default:
         return <ClassicTemplate resumeData={resumeData} colorPalette={selectedPalette} />;
     }
   };
   ```

4. **Create thumbnail and preview images**:
   - Add thumbnail image (small preview shown during selection) to `/public/templates/new-template-thumb.png`
   - Add full preview image to `/public/templates/new-template-preview.png`

## PDF Generation

The application uses the `react-to-pdf` library to generate PDF files from the resume template. The PDF is generated with A4 dimensions (210mm × 297mm) to ensure it prints correctly.

### Troubleshooting PDF Generation

If the PDF is blank or not generating correctly:

1. Check that the `targetRef` is properly connected to the resume component
2. Ensure all content is within the boundaries of the A4 page
3. Verify that all images and fonts are loading correctly
4. Make sure the PDF settings are configured correctly:
   ```jsx
   const { toPDF, targetRef } = usePDF({
     filename: 'resume.pdf',
     method: 'save',
     page: {
       format: 'a4',
       orientation: 'portrait',
     },
     canvas: {
       mimeType: "image/png",
       quality: 1, // Important for image quality
     },
   });
   ```

## Responsive Design

The templates use responsive design principles to ensure they look good on screens of all sizes. Key responsive features:

- `flex` and `grid` layouts that adjust to different screen sizes
- Media queries (`md:` prefixed classes) that apply different styles on different devices
- Percentage-based widths that adapt to the container size
- Print-specific classes (`print:`) that ensure the resume prints correctly

## Additional Resources

For more information about the technologies used in this project, refer to:
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

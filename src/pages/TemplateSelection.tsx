
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume, resumeTemplates, colorPalettes } from "@/context/ResumeContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function TemplateSelection() {
  const { resumeData, updateTemplate, updateColorPalette } = useResume();
  const { selectedTemplate, selectedColorPalette } = resumeData;

  return (
    <ResumeBuilderLayout
      title="Choose a Template & Color Scheme"
      subTitle="Select a template and color scheme for your resume."
    >
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {resumeTemplates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer overflow-hidden transition-all hover:shadow-md",
                selectedTemplate === template.id &&
                  "ring-2 ring-blue-600 ring-offset-2"
              )}
              onClick={() => updateTemplate(template.id)}
            >
              <CardContent className="p-2 relative">
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="aspect-[3/4] relative mb-2">
                  <img
                    src={template.thumbnail || `/placeholder.svg`}
                    alt={template.name}
                    className="object-cover w-full h-full rounded-sm border border-gray-200"
                  />
                </div>
                <p className="text-center text-sm font-medium">{template.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select Color Scheme</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {colorPalettes.map((palette) => (
            <div
              key={palette.id}
              className={cn(
                "cursor-pointer rounded-lg p-2 transition-all",
                selectedColorPalette === palette.id &&
                  "ring-2 ring-blue-600 ring-offset-2"
              )}
              onClick={() => updateColorPalette(palette.id)}
            >
              <div className="flex flex-col items-center">
                <div className="flex w-full h-6 rounded-sm overflow-hidden mb-2">
                  <div
                    className="w-1/3 h-full"
                    style={{ backgroundColor: palette.primary }}
                  ></div>
                  <div
                    className="w-1/3 h-full"
                    style={{ backgroundColor: palette.secondary }}
                  ></div>
                  <div
                    className="w-1/3 h-full"
                    style={{ backgroundColor: palette.accent }}
                  ></div>
                </div>
                <span className="text-xs text-center">{palette.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-medium mb-4">Preview</h3>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {selectedTemplate && (
            <div className="aspect-[210/297] max-h-[500px] overflow-hidden">
              <img
                src={resumeTemplates.find(t => t.id === selectedTemplate)?.previewImage || `/placeholder.svg`}
                alt="Template Preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      <NavigationButtons prevPath="/" nextPath="/personal-details" />
    </ResumeBuilderLayout>
  );
}

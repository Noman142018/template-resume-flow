
import { useState } from "react";
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function WorkExperience() {
  const { resumeData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResume();
  const { workExperience } = resumeData;
  const { toast } = useToast();

  // Validate form before proceeding
  const validateForm = () => {
    // For work experience, we'll allow proceeding even with no entries
    // But if there are entries, they should be complete
    
    if (workExperience.length > 0) {
      const incompleteExperience = workExperience.some(
        (exp) => !exp.jobTitle || !exp.company
      );
      
      if (incompleteExperience) {
        toast({
          title: "Incomplete Work Experience",
          description: "Please complete all work experience entries.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  return (
    <ResumeBuilderLayout
      title="Work Experience"
      subTitle="Add your professional work experience."
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Work Experience</h3>
          <Button variant="outline" size="sm" onClick={addWorkExperience}>
            <Plus className="h-4 w-4 mr-2" /> Add Experience
          </Button>
        </div>
        
        {workExperience.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No work experience added yet.</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={addWorkExperience}>
              <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {workExperience.map((exp) => (
              <Card key={exp.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                    <h4 className="font-medium">
                      {exp.jobTitle ? `${exp.jobTitle} at ${exp.company}` : "New Experience Entry"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWorkExperience(exp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`jobTitle-${exp.id}`}>Job Title</Label>
                      <Input
                        id={`jobTitle-${exp.id}`}
                        value={exp.jobTitle}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, { jobTitle: e.target.value })
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`company-${exp.id}`}>Company</Label>
                      <Input
                        id={`company-${exp.id}`}
                        value={exp.company}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, { company: e.target.value })
                        }
                        placeholder="Company Name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                        <Input
                          id={`startDate-${exp.id}`}
                          type="month"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateWorkExperience(exp.id, { startDate: e.target.value })
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                        <Input
                          id={`endDate-${exp.id}`}
                          type="month"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateWorkExperience(exp.id, { endDate: e.target.value })
                          }
                          placeholder="Present"
                        />
                        <p className="text-xs text-gray-500">Leave empty for "Present"</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`description-${exp.id}`}>Job Description (Optional)</Label>
                      <Textarea
                        id={`description-${exp.id}`}
                        value={exp.description}
                        onChange={(e) =>
                          updateWorkExperience(exp.id, { description: e.target.value })
                        }
                        placeholder="Describe your responsibilities, achievements, and skills used in this role..."
                        rows={4}
                      />
                      <p className="text-xs text-gray-500">
                        Tip: Use bullet points starting with "• " for better formatting
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-gray-500 text-sm">
          <p>Tip: Start with your most recent work experience.</p>
        </div>
      </div>
      
      <NavigationButtons
        prevPath="/education"
        nextPath="/preview"
        onNextClick={validateForm}
      />
    </ResumeBuilderLayout>
  );
}

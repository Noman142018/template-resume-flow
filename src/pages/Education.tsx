
import React, { useState } from "react";
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function Education() {
  const { resumeData, addEducation, updateEducation, removeEducation, addSkill, removeSkill } = useResume();
  const { education, skills } = resumeData;
  const { toast } = useToast();
  
  const [newSkill, setNewSkill] = useState("");
  
  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };
  
  // Add skill when Enter key is pressed
  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };
  
  // Validate form before proceeding
  const validateForm = () => {
    // Check if at least one education entry is filled out completely
    if (education.length === 0) {
      toast({
        title: "Education Required",
        description: "Please add at least one education entry.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if all education entries are complete
    const incompleteEducation = education.some(
      (edu) => !edu.degree || !edu.institution || !edu.fieldOfStudy
    );
    
    if (incompleteEducation) {
      toast({
        title: "Incomplete Education",
        description: "Please complete all education entries.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return (
    <ResumeBuilderLayout
      title="Education & Skills"
      subTitle="Add your educational background and skills."
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Education</h3>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-2" /> Add Education
            </Button>
          </div>
          
          {education.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No education added yet.</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <Card key={edu.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                      <h4 className="font-medium">
                        {edu.degree || "New Education Entry"}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                        <Input
                          id={`degree-${edu.id}`}
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, { degree: e.target.value })
                          }
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                        <Input
                          id={`field-${edu.id}`}
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            updateEducation(edu.id, { fieldOfStudy: e.target.value })
                          }
                          placeholder="Computer Science"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                        <Input
                          id={`institution-${edu.id}`}
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(edu.id, { institution: e.target.value })
                          }
                          placeholder="University of Example"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                          <Input
                            id={`startDate-${edu.id}`}
                            type="month"
                            value={edu.startDate}
                            onChange={(e) =>
                              updateEducation(edu.id, { startDate: e.target.value })
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                          <Input
                            id={`endDate-${edu.id}`}
                            type="month"
                            value={edu.endDate}
                            onChange={(e) =>
                              updateEducation(edu.id, { endDate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                <span className="mr-1">{skill.name}</span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="text-gray-500 text-sm">
                Add skills to showcase your expertise.
              </div>
            )}
          </div>
          <div className="flex">
            <Input
              placeholder="Add a skill (e.g. Project Management)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="max-w-md"
            />
            <Button 
              variant="outline" 
              onClick={handleAddSkill}
              disabled={!newSkill.trim()} 
              className="ml-2"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to add each skill
          </p>
        </div>
      </div>
      
      <NavigationButtons
        prevPath="/personal-details"
        nextPath="/work-experience"
        onNextClick={validateForm}
      />
    </ResumeBuilderLayout>
  );
}

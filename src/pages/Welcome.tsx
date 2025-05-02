
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, User, FileText } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Check for authenticated user
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <ResumeBuilderLayout 
      title="Create Your Professional Resume" 
      hideProgress
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 space-y-6">
          <h3 className="text-2xl font-medium text-gray-800">Resume Builder</h3>
          <p className="text-gray-600">
            Create a professional resume in minutes. Choose a template, add your information, and download your resume.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate("/template")} 
              size="lg"
              className="flex gap-2 items-center"
            >
              <FileText className="w-4 h-4" />
              Create Resume <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            {user ? (
              <Button 
                variant="outline" 
                onClick={() => navigate("/account")} 
                size="lg"
                className="flex gap-2 items-center"
              >
                <User className="w-4 h-4" />
                My Account
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate("/preview")} 
                size="lg"
                className="flex gap-2 items-center"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h4 className="font-medium">Professional Templates</h4>
                <p className="text-gray-600 text-sm">
                  Choose from modern and classic templates that will make your resume stand out.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-medium">Easy to Use</h4>
                <p className="text-gray-600 text-sm">
                  Our simple step-by-step process makes creating a resume quick and easy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h4 className="font-medium">Download & Save</h4>
                <p className="text-gray-600 text-sm">
                  Download your resume as a PDF and save it to your account for future edits.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <img 
              src="/resume-illustration.svg" 
              alt="Resume illustration" 
              className="w-full"
            />
          </div>
        </div>
      </div>
    </ResumeBuilderLayout>
  );
}


import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <ResumeBuilderLayout
      title="Resume Builder"
      subTitle="Create a professional resume in minutes by entering your details and choosing a beautiful template."
      hideProgress
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-12">
          <div className="mb-8 flex justify-center">
            <img
              src="/resume-illustration.svg"
              alt="Resume Builder"
              className="h-64"
            />
          </div>
          <p className="text-gray-600 mb-8">
            Our easy-to-use resume builder will help you create a professional
            resume that showcases your skills, experience, and education. Just
            follow the steps, fill in your details, and download your resume in
            PDF format.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => navigate("/template")}
            >
              Start Building
            </Button>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Why use our Resume Builder?</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Professional Templates</h4>
              <p className="text-sm text-gray-500">
                Choose from professionally designed templates that catch the eye.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Easy to Use</h4>
              <p className="text-sm text-gray-500">
                Simple step-by-step process to create your perfect resume.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">PDF Download</h4>
              <p className="text-sm text-gray-500">
                Get your resume in a professional PDF format ready to send.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ResumeBuilderLayout>
  );
}

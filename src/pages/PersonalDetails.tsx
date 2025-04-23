
import { useState } from "react";
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import NavigationButtons from "@/components/NavigationButtons";
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PersonalDetails() {
  const { resumeData, updatePersonalDetails } = useResume();
  const { personalDetails } = resumeData;
  const { toast } = useToast();
  
  // Local state for form validation
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    phone: false,
    address: false,
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalDetails({
          ...personalDetails,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input change
  const handleChange = (field: string, value: string) => {
    const updatedDetails = { ...personalDetails, [field]: value };
    updatePersonalDetails(updatedDetails);
  };

  // Form validation before proceeding
  const validateForm = () => {
    const newErrors = {
      fullName: !personalDetails.fullName,
      email: !personalDetails.email,
      phone: !personalDetails.phone,
      address: !personalDetails.address,
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return (
    <ResumeBuilderLayout
      title="Personal Details"
      subTitle="Enter your personal and contact information."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={personalDetails.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">Full name is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={personalDetails.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john.doe@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">Email is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={personalDetails.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">Phone number is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={personalDetails.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main St, City, Country"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-xs text-red-500">Address is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedin"
              value={personalDetails.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                {personalDetails.profilePicture ? (
                  <img
                    src={personalDetails.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No image</span>
                )}
              </div>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">
              Professional Summary / Objective (Optional)
            </Label>
            <Textarea
              id="summary"
              value={personalDetails.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Brief overview of your professional background and career goals..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Max 4 lines recommended (approximately 300 characters)
            </p>
          </div>
        </div>
      </div>

      <NavigationButtons
        prevPath="/template"
        nextPath="/education"
        onNextClick={validateForm}
      />
    </ResumeBuilderLayout>
  );
}

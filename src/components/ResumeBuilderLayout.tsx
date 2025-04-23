
import { ReactNode } from "react";
import StepProgress from "@/components/StepProgress";

type ResumeBuilderLayoutProps = {
  children: ReactNode;
  title: string;
  subTitle?: string;
  hideProgress?: boolean;
};

export default function ResumeBuilderLayout({
  children,
  title,
  subTitle,
  hideProgress = false,
}: ResumeBuilderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Resume Builder</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 max-w-5xl">
        {!hideProgress && <StepProgress className="mb-8" />}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subTitle && <p className="text-gray-500 mt-2">{subTitle}</p>}
          </div>

          {children}
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        Resume Builder &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}


import { useEffect, useState, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import ResumeTemplate from '@/components/resume-templates/ResumeTemplate';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

export default function ResumePreview() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const resumeRef = useRef<HTMLDivElement>(null);

  // PDF generation setup - fixed to remove invalid 'quality' property
  const { toPDF, targetRef } = usePDF({
    filename: resumeData?.personalDetails.fullName 
      ? `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf` 
      : 'Resume.pdf',
    method: 'save',
    page: {
      format: 'a4',
      orientation: 'portrait',
    },
    canvas: {
      mimeType: "image/png",
      // Removed quality property as it's not in the type definition
    },
  });

  // Load resume data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('previewResumeData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setResumeData(parsedData);
      } catch (error) {
        console.error('Failed to parse resume data:', error);
      }
    }
    
    // Set a zoom level that makes the resume fit well on mobile and desktop
    // This matches what 40% zoom looked like before, but sets it as the new 100%
    const setInitialZoom = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        // For mobile, set to 100% (which is actually scaled down in the CSS)
        setZoomLevel(100);
      } else if (screenWidth < 1024) {
        // For tablets
        setZoomLevel(100);
      } else {
        // For desktops
        setZoomLevel(100);
      }
    };
    
    setInitialZoom();
    
    // Add event listener for pinch-to-zoom for mobile
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleDownload = () => {
    // Ensure the PDF is generated at full A4 size regardless of current view
    toPDF();
  };

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Resume Preview Not Available</h1>
          <p className="text-gray-500 mb-6">
            No resume data found. Please return to the resume builder.
          </p>
          <Button onClick={() => window.close()}>Close Preview</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Redesigned Toolbar with clean layout */}
      <div className="bg-white border-b py-3 px-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Zoom controls - positioned left */}
          <div className="flex items-center border rounded-md overflow-hidden bg-white">
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 px-2 rounded-none border-r"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <button 
              onClick={handleResetZoom}
              className="px-2 text-sm font-medium hover:bg-gray-50"
            >
              {zoomLevel}%
            </button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 px-2 rounded-none border-l"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Centered title with adequate spacing */}
        <div className="text-lg font-medium text-center flex-1 px-6">Resume Preview</div>
        
        {/* Download button - positioned right */}
        <Button 
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>
      
      {/* Notice bar */}
      <div className="bg-blue-50 text-blue-800 py-2 px-4 text-center text-sm">
        To go back to the resume builder, close this tab or press the back button on your device.
      </div>

      {/* Resume Preview Container */}
      <div 
        className="flex-1 overflow-auto py-8 px-4"
        style={{
          touchAction: "manipulation",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div 
          className="mx-auto flex justify-center"
          style={{ 
            maxWidth: '100%',
            padding: '0 20px',
            overflowX: 'auto'
          }}
        >
          {/* This scales down the A4 size to fit better on screens while maintaining the A4 aspect ratio */}
          <div 
            className="bg-white shadow-lg mx-auto transition-transform overflow-visible"
            style={{
              // Instead of using transform to scale, we're directly sizing it to what was previously ~40% of A4
              width: '317px', 
              height: '449px',
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              marginBottom: `${zoomLevel > 100 ? ((zoomLevel - 100) * 2) : 0}px`,
              margin: '0 auto'
            }}
          >
            {/* Maintain A4 aspect ratio but with smaller default size */}
            <div 
              ref={targetRef} 
              className="w-full h-full"
              style={{
                // Visually smaller but maintains A4 aspect ratio (210:297)
                position: 'relative'
              }}
            >
              <ResumeTemplate resumeData={resumeData} ref={resumeRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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

  // PDF generation setup
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
      quality: 1,
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
    
    // Set initial zoom level based on screen width for better mobile experience
    const setInitialZoom = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        // For mobile, use a smaller zoom level
        setZoomLevel(70);
      } else if (screenWidth < 1024) {
        // For tablets
        setZoomLevel(85);
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
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 40));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleDownload = () => {
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
      {/* Toolbar */}
      <div className="bg-white border-b py-3 px-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Zoom controls - moved to left */}
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
        
        <div className="text-lg font-medium text-center flex-1">Resume Preview</div>
        
        {/* Download button - moved to right */}
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
          WebkitOverflowScrolling: "touch"
        }}
      >
        <div 
          className="mx-auto" 
          style={{ 
            maxWidth: '900px',
            padding: '0 20px'
          }}
        >
          {/* A4-sized container that scales with zoom */}
          <div 
            className="bg-white shadow-lg mx-auto transition-transform"
            style={{
              width: '210mm', 
              height: '297mm', 
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              marginBottom: `${zoomLevel > 100 ? ((zoomLevel - 100) * 2.97) : 0}mm`,
              margin: '0 auto'
            }}
          >
            {/* Resume content */}
            <div 
              ref={targetRef} 
              className="w-full h-full"
            >
              <ResumeTemplate resumeData={resumeData} ref={resumeRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

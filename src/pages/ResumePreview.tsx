
import { useEffect, useState, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import ResumeTemplate from '@/components/resume-templates/ResumeTemplate';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { useNavigate } from 'react-router-dom';

export default function ResumePreview() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const resumeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // PDF generation setup with proper options
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
    },
  });

  // Load resume data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('previewResumeData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setResumeData(parsedData);
        console.log("Resume data loaded successfully", parsedData);
      } catch (error) {
        console.error('Failed to parse resume data:', error);
        // We'll handle this error in the UI
      }
    } else {
      console.error('No resume data found in session storage');
    }
    
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
    // Ensure we're generating the PDF at full A4 size
    if (targetRef.current) {
      console.log("Generating PDF from current view");
      toPDF();
    } else {
      console.error("Target ref for PDF generation is not available");
    }
  };

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <h1 className="text-xl font-semibold mb-4">Resume Preview Not Available</h1>
          <p className="text-gray-500 mb-6">
            No resume data found. Please return to the resume builder and try again.
          </p>
          <div className="space-y-4">
            <Button onClick={() => window.close()}>Close Preview</Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/preview')}
              className="ml-2"
            >
              Return to Builder
            </Button>
          </div>
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
          {/* A4 dimensions scaled down to ~40% (317px width) as the new 100% baseline */}
          <div 
            className="bg-white shadow-lg mx-auto transition-transform"
            style={{
              width: '317px', 
              height: '449px',
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              marginBottom: `${zoomLevel > 100 ? ((zoomLevel - 100) * 2) : 0}px`,
              margin: '0 auto'
            }}
          >
            {/* Direct resume content at the scaled down size */}
            <div 
              ref={targetRef} 
              className="w-full h-full"
            >
              <ResumeTemplate resumeData={resumeData} ref={resumeRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden div at full A4 size for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, visibility: 'hidden' }}>
        <div style={{ width: '210mm', height: '297mm' }}>
          <ResumeTemplate resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import ResumeBuilderLayout from "@/components/ResumeBuilderLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileText, Trash2, Download } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useResume } from "@/context/ResumeContext";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateState } = useResume();
  
  // Handle user auth state
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

  // Redirect if not logged in
  useEffect(() => {
    if (user === null && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Fetch saved resumes
  useEffect(() => {
    const fetchSavedResumes = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSavedResumes(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching resumes",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSavedResumes();
    }
  }, [user, toast]);

  // Sign out user
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  // Delete a resume
  const handleDeleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSavedResumes(savedResumes.filter(resume => resume.id !== id));
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting resume",
        description: error.message,
      });
    }
  };

  // Load a saved resume
  const handleLoadResume = (resumeData: any) => {
    try {
      updateState(resumeData.data);
      toast({
        title: "Resume loaded",
        description: "Your saved resume has been loaded successfully.",
      });
      navigate('/preview');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading resume",
        description: error.message || "Failed to load resume data.",
      });
    }
  };

  if (loading || !user) {
    return (
      <ResumeBuilderLayout title="Account" hideProgress>
        <div className="flex justify-center">
          <p>Loading...</p>
        </div>
      </ResumeBuilderLayout>
    );
  }

  return (
    <ResumeBuilderLayout 
      title="My Account" 
      subTitle="Manage your account and saved resumes"
      hideProgress
    >
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Account Info</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Saved Resumes</h3>
        
        {savedResumes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">You haven't saved any resumes yet</p>
            <Button className="mt-4" onClick={() => navigate('/')}>Create Resume</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedResumes.map((resume) => (
              <Card key={resume.id}>
                <CardHeader>
                  <CardTitle className="truncate">{resume.name}</CardTitle>
                  <CardDescription>
                    Created: {new Date(resume.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-24 overflow-hidden bg-gray-50 flex items-center justify-center rounded">
                    <FileText className="h-10 w-10 text-gray-300" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="secondary" onClick={() => handleLoadResume(resume)}>
                    Open
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this resume. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteResume(resume.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </ResumeBuilderLayout>
  );
}

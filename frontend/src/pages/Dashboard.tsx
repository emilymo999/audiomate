import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { InputForm } from "@/components/dashboard/InputForm";
import { ScriptPanel } from "@/components/dashboard/ScriptPanel";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Reset dashboard when 'new' query param is present
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setGeneratedScript("");
      setShowSplitView(false);
      setResetKey(prev => prev + 1);
      // Clear the query param
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setShowSplitView(true); // Switch to split view when generation starts
    
    // Simulate script generation
    setTimeout(() => {
      const script = `Introducing ${formData.product_name}! ${formData.product_details} 
      
Perfect for ${formData.target_audience}. Available now on ${formData.distribution_method}. 

Don't miss out - experience the difference today!`;
      
      setGeneratedScript(script);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Orange gradient background from the right */}
        <div className="absolute inset-0 bg-gradient-to-l from-orange-100/70 via-orange-50/30 to-transparent dark:from-orange-950/40 dark:via-orange-950/15 dark:to-transparent pointer-events-none" />
        
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-end px-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-foreground" />
                )}
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {!showSplitView ? (
              /* Centered single column view */
              <div className="h-full flex items-center justify-center">
                <div className="w-full max-w-3xl">
                  <InputForm key={resetKey} onGenerate={handleGenerate} isGenerating={isGenerating} />
                </div>
              </div>
            ) : (
              /* Two column split view */
              <div className="h-full grid lg:grid-cols-2 gap-6">
                <InputForm key={resetKey} onGenerate={handleGenerate} isGenerating={isGenerating} />
                <ScriptPanel script={generatedScript} isGenerating={isGenerating} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

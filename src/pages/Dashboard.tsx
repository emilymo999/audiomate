import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { InputForm } from "@/components/dashboard/InputForm";
import { ScriptPanel } from "@/components/dashboard/ScriptPanel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    
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
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
            <h1 className="text-xl font-semibold">Audio Ad Generator</h1>
            <Button variant="hero" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </header>

          {/* Main Content */}
          <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6">
            <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            <ScriptPanel script={generatedScript} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

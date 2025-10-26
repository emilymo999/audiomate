import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Library = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Orange gradient background from the right */}
        <div className="absolute inset-0 bg-gradient-to-l from-orange-100/40 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent pointer-events-none" />
        
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
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Generated Ad Audios</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Generated MP3 Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generated MP3 files will show up here
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Library;

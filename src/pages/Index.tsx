import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import logo from "@/assets/audiomate-logo.png";
import gradientBg from "@/assets/gradient-bg.jpg";

const Index = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `url(${gradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Dark overlay for dark mode */}
      <div className="absolute inset-0 z-0 bg-background/40 dark:bg-background/60 backdrop-blur-sm" />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 z-50 p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Audiomate" className="h-32 w-32" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
          <span className="bg-gradient-warm bg-clip-text text-transparent">
            Audiomate
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl font-semibold text-foreground">
          Generate. Personalize. Broadcast.
        </p>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
          Create high-impact audio ads with AI—instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link to="/dashboard">
            <Button variant="hero" size="xl" className="group">
              Get Started
              <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
          <a href="https://www.youtube.com/watch?v=VMKuxWplExY" target="_blank" rel="noopener noreferrer">
            <Button variant="outline-hero" size="xl" className="group">
              <Play className="mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;

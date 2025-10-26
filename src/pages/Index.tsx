import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Zap, Music } from "lucide-react";
import logo from "@/assets/audiomate-logo.png";
import heroBackground from "@/assets/hero-background.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Audiomate" className="h-10 w-10" />
            <span className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              Audiomate
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Get Your Message Out{" "}
              <span className="bg-gradient-warm bg-clip-text text-transparent">
                In Seconds
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Generate high-quality audio advertisements powered by AI. 
              Transform your product details into compelling audio ads instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
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
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Choose Audiomate?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-warm transition-shadow">
                <div className="h-12 w-12 bg-gradient-warm rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Generate professional audio ads in seconds, not hours. Perfect for tight deadlines.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-warm transition-shadow">
                <div className="h-12 w-12 bg-gradient-warm rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Scripts</h3>
                <p className="text-muted-foreground">
                  Our LLM generates compelling, conversion-focused scripts tailored to your brand.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-warm transition-shadow">
                <div className="h-12 w-12 bg-gradient-warm rounded-lg flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Studio Quality</h3>
                <p className="text-muted-foreground">
                  Powered by ElevenLabs, delivering human-like voice synthesis with emotion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Audiomate" className="h-8 w-8" />
              <span className="text-lg font-semibold">Audiomate</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Audiomate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

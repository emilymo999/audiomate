import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown, Sparkles, Zap, Wand2, Mic } from "lucide-react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import logo from "@/assets/audiomate-logo.png";
import gradientBg from "@/assets/gradient-bg.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const { theme, setTheme } = useTheme();

  const companies = [
    {
      title: "Nonprofits",
      description: "Amplify your mission with compelling audio campaigns. Reach donors and volunteers with authentic, cost-effective messaging that resonates."
    },
    {
      title: "Small & Medium Businesses",
      description: "Unlock new growth and reach local customers with affordable, fast-turnaround audio campaigns. Create high-impact messaging without the need for large marketing teams."
    },
    {
      title: "Startups",
      description: "Accelerate brand awareness from day one. Share your mission and product value clearly with agile, data-driven audio campaigns that scale as you grow."
    },
    {
      title: "Large Organizations",
      description: "Scale your advertising efforts with enterprise-grade AI. Generate hundreds of personalized ads in minutes for global campaigns."
    },
    {
      title: "Educational Institutions",
      description: "Engage prospective students, alumni, and donors with authentic messaging tailored to diverse audiences across radio, streaming, and digital channels."
    },
    {
      title: "E-Commerce Brands",
      description: "Drive conversions with dynamic, product-focused audio ads designed to boost sales. Deliver timely promotions directly to shoppers across streaming and social audio placements."
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Generation",
      description: "Create professional audio ads in under 60 seconds—no audio expertise required."
    },
    {
      icon: Wand2,
      title: "AI-Powered Scripting",
      description: "Advanced language models craft compelling ad copy tailored to your brand and audience."
    },
    {
      icon: Mic,
      title: "Voice Customization",
      description: "Choose from diverse voice profiles or clone your own voice for authentic brand representation."
    }
  ];

  const faqs = [
    {
      question: "What inputs do I need to generate an ad?",
      answer: "You'll need to provide your company context, product details, brand values, target audience, ad tone, length, and distribution platform."
    },
    {
      question: "How do I choose the voice for my ad?",
      answer: "You can select from preset voices by gender, age, and tone—or upload an audio sample to clone a voice."
    },
    {
      question: "Can I edit the script before the audio is generated?",
      answer: "Absolutely. Once the script is generated, you'll be able to review and edit it directly in the interface."
    },
    {
      question: "How long does it take to generate an audio ad?",
      answer: "Most ads are ready in under a minute after input is complete and the script is finalized."
    },
    {
      question: "Can I add music or sound effects?",
      answer: "Yes. You can choose a background music style (e.g., upbeat, cinematic, calm) to be layered behind the voice."
    },
    {
      question: "Does the system support other languages?",
      answer: "Yes. You can generate scripts and audio in multiple languages, including Spanish, Hindi, French, and more."
    },
    {
      question: "Can I generate more than one version of an ad?",
      answer: "Yes, you can regenerate or tweak scripts and voices to A/B test different variations."
    },
    {
      question: "Where can I download or share the final ad?",
      answer: "Once generated, your MP3 will be available for download or direct integration into your campaign tools."
    },
    {
      question: "Is Audiomate the best CalHacks project?",
      answer: "Yes! 🎉"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          backgroundImage: `url(${gradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95 dark:from-background/98 dark:via-background/95 dark:to-background/98" />
      
      {/* Light mode radial gradient overlay */}
      <div className="fixed inset-0 z-0 dark:hidden bg-gradient-radial opacity-0 animate-fade-in pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 60%, hsl(var(--primary) / 0.15) 0%, hsl(var(--accent) / 0.12) 30%, transparent 70%)',
        animationDuration: '1.5s',
        animationFillMode: 'forwards'
      }} />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-float">
            <img src={logo} alt="Audiomate" className="h-24 w-24 md:h-32 md:w-32" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-warm bg-clip-text text-transparent">
              Audiomate
            </span>
          </h1>

          {/* Subtitle */}
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              Generate. Personalize. Broadcast.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Create high-impact audio ads with AI—instantly.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 mb-16">
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

        {/* Explore More Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium animate-float-slow">Explore more</span>
          <ChevronDown className="h-6 w-6 animate-bounce-gentle" />
        </div>
      </section>

      {/* Companies Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Applicable to various companies
          </h2>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              })
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {companies.map((company, index) => {
                const colors = [
                  "from-orange-500/10 to-orange-600/5 border-orange-500/30 hover:border-orange-500/50",
                  "from-blue-500/10 to-blue-600/5 border-blue-500/30 hover:border-blue-500/50",
                  "from-purple-500/10 to-purple-600/5 border-purple-500/30 hover:border-purple-500/50",
                  "from-green-500/10 to-green-600/5 border-green-500/30 hover:border-green-500/50",
                  "from-pink-500/10 to-pink-600/5 border-pink-500/30 hover:border-pink-500/50",
                  "from-amber-500/10 to-amber-600/5 border-amber-500/30 hover:border-amber-500/50"
                ];
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className={`group p-8 rounded-2xl bg-gradient-to-br backdrop-blur-sm border transition-all duration-300 hover:shadow-warm h-full ${colors[index]}`}>
                      <h3 className="text-xl font-semibold mb-4 text-foreground">{company.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {company.description}
                      </p>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-card/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Why choose Audiomate?
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
            Everything you need to create professional audio advertisements in minutes
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="group p-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-warm animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            FAQ — Audio Ad Generator
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-r from-card/60 to-primary/5 backdrop-blur-sm border border-border rounded-xl px-6 hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div 
          className="max-w-5xl mx-auto rounded-3xl p-16 text-center relative overflow-hidden animate-fade-in hover-scale"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--accent) / 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsl(var(--border))',
            animationDelay: '0.2s'
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands already creating professional audio ads with AI. Start broadcasting your message today.
          </p>
          <Link to="/dashboard">
            <Button variant="hero" size="xl" className="group">
              Get Started Now
              <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-24" />
    </div>
  );
};

export default Index;

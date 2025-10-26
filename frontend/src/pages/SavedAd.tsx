import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FileText, Moon, Sun, Volume2, Music, Play, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const savedAdsData = {
  "summer-sale": {
    title: "Summer Sale Campaign",
    adDetails: {
      productName: "SunnyWear Summer Collection",
      productDetails: "Lightweight, breathable apparel designed for hot weather. Includes shorts, tees, activewear, and airy dresses. Discounts up to 40 percent for a limited time.",
      companyContext: "SunnyWear is a California based clothing brand focused on sustainable, stylish lifestyle apparel.",
      previousAds: "Cool comfort for every adventure. Shop our seasonal drop today.",
      targetAudience: "Young adults, outdoor lovers, beach travelers",
      distributionMethod: "Spotify, Radio, Social Audio",
      language: "English",
      adLength: "30 seconds"
    },
    voiceSettings: {
      backgroundMusic: "Pop-Upbeat",
      gender: "Female",
      tone: "Energetic",
      reason: "Summer campaigns benefit from lively, fun energy that grabs attention on streaming and radio."
    },
    generatedScript: "Get ready for summer with SunnyWear's new collection! Lightweight, breathable styles perfect for any adventure. From the beach to the trail, stay cool and comfortable. Shop now and save up to 40% on shorts, tees, activewear, and breezy dresses. SunnyWear - sustainable style for your summer story. Visit us today!",
    hasAudio: true
  },
  "product-launch": {
    title: "Product Launch Audio",
    adDetails: {
      productName: "AquaPure Smart Water Bottle",
      productDetails: "Tracks daily hydration, syncs with a mobile app, and self cleans using UV sterilization. Battery lasts 30 days per charge.",
      companyContext: "AquaPure creates health forward products that encourage wellness through smart technology.",
      previousAds: "Hydration made smarter. Drink better every day.",
      targetAudience: "Tech enthusiasts, students, fitness focused consumers",
      distributionMethod: "Podcast Ads, Streaming Platforms",
      language: "English",
      adLength: "30 seconds"
    },
    voiceSettings: {
      backgroundMusic: "Electronic-Ambient",
      gender: "Male",
      tone: "Professional",
      reason: "Tech product ads typically lean toward polished, modern sound design that conveys credibility."
    },
    generatedScript: "Introducing AquaPure - the smart water bottle that transforms how you hydrate. Track your daily intake, get reminders, and enjoy UV self-cleaning technology. With 30-day battery life and seamless app syncing, staying healthy has never been easier. Perfect for students, gym-goers, and anyone who values wellness. AquaPure - hydration made smarter. Get yours today!",
    hasAudio: true
  },
  "holiday-special": {
    title: "Holiday Special Ad",
    adDetails: {
      productName: "CozyGlow Holiday Candle Set",
      productDetails: "Hand poured soy candles with festive scents including pine forest, peppermint, and gingerbread. Comes gift wrapped with premium packaging.",
      companyContext: "CozyGlow focuses on handcrafted, eco friendly home fragrance products made in small batches.",
      previousAds: "Fill your home with warmth and comfort from the first light.",
      targetAudience: "Home décor shoppers, gift buyers, families",
      distributionMethod: "Radio, Spotify, In store audio ads",
      language: "English",
      adLength: "30 seconds"
    },
    voiceSettings: {
      backgroundMusic: "Festive-Holiday Bells",
      gender: "Female",
      tone: "Warm",
      reason: "Holiday offers must evoke coziness and emotion, especially for gift-oriented products."
    },
    generatedScript: "Light up the holidays with CozyGlow's festive candle collection! Hand-poured soy candles in pine forest, peppermint, and gingerbread scents. Each set comes beautifully gift-wrapped and ready to spread joy. Eco-friendly, handcrafted in small batches with love. Perfect for your home or as a thoughtful gift. CozyGlow - where warmth meets wonder. Shop now!",
    hasAudio: true
  }
};

const SavedAd = () => {
  const { id } = useParams();
  const { theme, setTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const adData = savedAdsData[id as keyof typeof savedAdsData];

  if (!adData) {
    return <div>Ad not found</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Orange gradient background from the right */}
        <div className="absolute inset-0 bg-gradient-to-l from-orange-100/40 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent pointer-events-none" />
        
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
            <h1 className="text-xl font-semibold">{adData.title}</h1>
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

          {/* Main Content - Two Column Layout */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Ad Details */}
              <div className="space-y-6">
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Ad Details
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fill in the details below to generate your custom ad script
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Name</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.productName}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Details</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.productDetails}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Context</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.companyContext}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Previous Example Ads (Optional)</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.previousAds}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Audience</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.targetAudience}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Distribution Method</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.distributionMethod}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Language</label>
                        <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.language}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ad Length</label>
                        <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.adDetails.adLength}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Generated Script, Voice Settings & Audio */}
              <div className="space-y-6">
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Generated Script
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={adData.generatedScript}
                      readOnly
                      rows={3}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Voice Settings */}
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Voice Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Background Music Style</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.voiceSettings.backgroundMusic}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Gender</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.voiceSettings.gender}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tone</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">{adData.voiceSettings.tone}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Reason</label>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground italic">
                        {adData.voiceSettings.reason}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Audio */}
                {adData.hasAudio && (
                  <Card className="border-border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        Generated Audio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Audio Player Controls */}
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? (
                              <Play className="h-5 w-5 fill-current" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </Button>
                          
                          <div className="flex-1 text-sm font-medium">
                            Audio Ad - Final Mix
                          </div>
                          
                          <Volume2 className="h-5 w-5 text-muted-foreground" />
                          
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-warm rounded-full transition-all duration-300"
                              style={{ width: "40%" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0:23</span>
                            <span>0:30</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SavedAd;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Download, Edit, Volume2, Pause, RotateCcw, RotateCw, FileText, Music } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ScriptPanelProps {
  script: string;
  isGenerating: boolean;
}

export function ScriptPanel({ script, isGenerating }: ScriptPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState(script);
  const [voiceGender, setVoiceGender] = useState("female");
  const [voiceTone, setVoiceTone] = useState("friendly");
  const [backgroundMusic, setBackgroundMusic] = useState("none");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerateAudio = () => {
    setIsGeneratingAudio(true);
    // Simulate audio generation
    setTimeout(() => {
      setIsGeneratingAudio(false);
      setAudioGenerated(true);
    }, 2000);
  };

  useEffect(() => {
    setEditedScript(script);
  }, [script]);

  return (
    <div className="space-y-6 flex flex-col">
      {/* Generated Script */}
      <Card className="shadow-soft flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Script
          </CardTitle>
          {script && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Done" : "Edit"}
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1">
          {isGenerating ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>
          ) : script ? (
            isEditing ? (
              <Textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                rows={3}
                className="font-mono text-sm"
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground text-sm">{editedScript}</p>
              </div>
            )
          ) : (
            <div className="py-3 space-y-2">
              <p className="text-foreground leading-relaxed text-sm">
                In the ancient land of Eldoria, where skies shimmered and forests whispered secrets...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Settings */}
      {script && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Background Music Style</Label>
              <Select value={backgroundMusic} onValueChange={setBackgroundMusic}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="upbeat">Upbeat</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="acoustic">Acoustic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={voiceGender} onValueChange={setVoiceGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={voiceTone} onValueChange={setVoiceTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="hero" 
                className="flex-1"
                onClick={handleGenerateAudio}
                disabled={isGeneratingAudio}
              >
                <Play className="h-4 w-4 mr-2" />
                {isGeneratingAudio ? "Generating..." : "Generate Audio"}
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Player */}
      {script && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Generated Audio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {audioGenerated ? (
              <div className="space-y-4">
                {/* Audio Controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {}}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {}}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 text-sm font-medium">
                    Audio Ad - Final Mix
                  </div>
                  
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                      style={{ width: "45%" }}
                    />
                    <div 
                      className="absolute h-4 w-4 bg-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-lg"
                      style={{ left: "calc(45% - 8px)" }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0:23</span>
                    <span>0:30</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Generated audio will show up here
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

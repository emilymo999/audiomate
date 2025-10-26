import { useState, useEffect, useRef } from "react";
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
import { Download, Edit, FileText, Music, Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSpeech, getAudioUrl, GenerateSpeechRequest } from "@/services/api";

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface ScriptPanelProps {
  script: string;
  isGenerating: boolean;
  language?: string; // Add language prop
}

export function ScriptPanel({ script, isGenerating, language = "english" }: ScriptPanelProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState(script);
  const [voiceGender, setVoiceGender] = useState<"male" | "female" | "neutral">("female");
  const [voiceTone, setVoiceTone] = useState<"friendly" | "professional" | "casual" | "dramatic" | "calm">("friendly");
  const [backgroundMusic, setBackgroundMusic] = useState<"none" | "ambient" | "upbeat" | "classical" | "electronic" | "acoustic">("none");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerateAudio = async () => {
    if (!editedScript.trim()) {
      toast({
        title: "No script to generate",
        description: "Please provide a script before generating audio.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAudio(true);
    
    try {
      const requestData: GenerateSpeechRequest = {
        script: editedScript,
        tone: voiceTone,
        gender: voiceGender,
        background_music: backgroundMusic,
        language: language,
      };
      
      const response = await generateSpeech(requestData);
      
      // Set the audio URL
      const url = getAudioUrl(response.filename);
      setAudioUrl(url);
      setAudioGenerated(true);
      
      // Reset playback state
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      
      toast({
        title: "Audio generated successfully!",
        description: "Your speech synthesis is ready.",
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      
      toast({
        title: "Failed to generate audio",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
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
              <Select value={backgroundMusic} onValueChange={(value) => setBackgroundMusic(value as typeof backgroundMusic)}>
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
              <Select value={voiceGender} onValueChange={(value) => setVoiceGender(value as typeof voiceGender)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={voiceTone} onValueChange={(value) => setVoiceTone(value as typeof voiceTone)}>
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
            {audioGenerated && audioUrl ? (
              <div className="space-y-4">
                {/* Audio Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                      }
                    }}
                    disabled={duration === 0}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) {
                          audioRef.current.pause();
                          setIsPlaying(false);
                        } else {
                          audioRef.current.play();
                          setIsPlaying(true);
                        }
                      }
                    }}
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
                    className="h-10 w-10"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                      }
                    }}
                    disabled={duration === 0}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex-1 text-sm font-medium">
                    Generated Audio
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = audioUrl;
                      link.download = audioUrl.split('/').pop() || 'generated-audio.mp3';
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Bar - Clickable for scrubbing */}
                <div className="space-y-2">
                  <div 
                    className="relative h-3 bg-muted rounded-full overflow-visible cursor-pointer group"
                    onClick={(e) => {
                      if (audioRef.current && duration > 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        audioRef.current.currentTime = percentage * duration;
                      }
                    }}
                    onMouseMove={(e) => {
                      if (duration > 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        if (percentage >= 0 && percentage <= 1) {
                          e.currentTarget.style.cursor = 'pointer';
                        }
                      }
                    }}
                  >
                    {/* Progress Fill */}
                    <div 
                      className="absolute h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                      style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                    {/* Playhead Knob */}
                    <div 
                      className="absolute h-5 w-5 bg-orange-500 rounded-full top-1/2 -translate-y-1/2 shadow-lg cursor-grab active:cursor-grabbing transition-transform group-hover:scale-110"
                      style={{ left: duration > 0 ? `calc(${(currentTime / duration) * 100}% - 10px)` : '-10px' }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Hidden audio element for control */}
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    setCurrentTime(audio.currentTime);
                  }}
                  onLoadedMetadata={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    setDuration(audio.duration);
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
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

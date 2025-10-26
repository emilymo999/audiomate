import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Download, Edit, Volume2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ScriptPanelProps {
  script: string;
  isGenerating: boolean;
}

export function ScriptPanel({ script, isGenerating }: ScriptPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState(script);
  const [voiceGender, setVoiceGender] = useState("female");
  const [voiceAge, setVoiceAge] = useState("adult");
  const [voiceTone, setVoiceTone] = useState("friendly");
  const [speed, setSpeed] = useState([1.0]);

  useEffect(() => {
    setEditedScript(script);
  }, [script]);

  return (
    <div className="space-y-6">
      {/* Generated Script */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Script</CardTitle>
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
        <CardContent>
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
                rows={8}
                className="font-mono text-sm"
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground">{editedScript}</p>
              </div>
            )
          ) : (
            <div className="py-8 space-y-4">
              <p className="text-foreground leading-relaxed">
                In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. <span className="text-pink-500">[sarcastically]</span> Not the "burn it all down" kind... <span className="text-pink-500">[giggles]</span> but he was gentle, wise, with eyes like old stars. <span className="text-pink-500">[whispers]</span> Even the birds fell silent when he passed.
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={voiceGender} onValueChange={setVoiceGender}>
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
                <Label>Age</Label>
                <Select value={voiceAge} onValueChange={setVoiceAge}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="young">Young</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Speed</Label>
                <span className="text-sm font-medium">{speed[0].toFixed(1)}x</span>
              </div>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="hero" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Generate Audio
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

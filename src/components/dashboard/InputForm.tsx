import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Sparkles } from "lucide-react";

interface InputFormProps {
  onGenerate: (data: any) => void;
  isGenerating: boolean;
}

export function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_details: "",
    company_context: "",
    previous_example_ads: "",
    desired_length: 30,
    target_audience: "",
    distribution_method: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-soft flex flex-col">
      <CardHeader>
        <CardTitle>Ad Details</CardTitle>
        <p className="text-sm text-muted-foreground">Fill in the details below to generate your custom ad script</p>
      </CardHeader>
      <CardContent className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input
              id="product_name"
              value={formData.product_name}
              onChange={(e) => handleChange("product_name", e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_details">Product Details</Label>
            <Textarea
              id="product_details"
              value={formData.product_details}
              onChange={(e) => handleChange("product_details", e.target.value)}
              placeholder="Describe your product's key features and benefits"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_context">Company Context</Label>
            <Textarea
              id="company_context"
              value={formData.company_context}
              onChange={(e) => handleChange("company_context", e.target.value)}
              placeholder="Brief background about your company"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous_example_ads">Previous Example Ads (Optional)</Label>
            <Textarea
              id="previous_example_ads"
              value={formData.previous_example_ads}
              onChange={(e) => handleChange("previous_example_ads", e.target.value)}
              placeholder="Paste examples of ads that worked well for you"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => handleChange("target_audience", e.target.value)}
              placeholder="e.g., Young professionals, Parents, Tech enthusiasts"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distribution_method">Distribution Method</Label>
            <Input
              id="distribution_method"
              value={formData.distribution_method}
              onChange={(e) => handleChange("distribution_method", e.target.value)}
              placeholder="e.g., Radio, Spotify, Podcast"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Ad Length (seconds)</Label>
              <span className="text-sm font-medium">{formData.desired_length}s</span>
            </div>
            <Slider
              value={[formData.desired_length]}
              onValueChange={(value) => handleChange("desired_length", value[0])}
              min={15}
              max={60}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15s</span>
              <span>30s</span>
              <span>60s</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Ad Script
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateLego } from "@/lib/api";
import { LoadingModal } from "@/components/loading-modal";
import { ResultModal } from "@/components/result-modal";
import { useToast } from "@/hooks/use-toast";
import type { Creation } from "@shared/schema";

export default function LegoCreator() {
  const [, setLocation] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>(["blue"]);
  const [size, setSize] = useState("Medium (100-300 pieces)");
  const [complexity, setComplexity] = useState("Intermediate");
  const [theme, setTheme] = useState("Space");
  const [features, setFeatures] = useState<string[]>([]);
  const [result, setResult] = useState<Creation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const colors = [
    { name: "red", color: "bg-red-500" },
    { name: "blue", color: "bg-blue-500" },
    { name: "green", color: "bg-green-500" },
    { name: "yellow", color: "bg-yellow-500" },
    { name: "purple", color: "bg-purple-500" },
    { name: "orange", color: "bg-orange-500" },
    { name: "black", color: "bg-gray-800" },
    { name: "white", color: "bg-white border border-gray-300" },
  ];

  const themes = ["Space", "Castle", "City", "Nature"];
  const availableFeatures = ["Moving parts", "Transparent elements", "LED integration", "Modular design"];

  const generateMutation = useMutation({
    mutationFn: generateLego,
    onSuccess: (creation) => {
      setResult(creation);
      queryClient.invalidateQueries({ queryKey: ["/api/creations"] });
      toast({ title: "Success", description: "Your LEGO creation has been designed!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate LEGO creation. Please try again.", variant: "destructive" });
    },
  });

  const handleColorToggle = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName)
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({ title: "Error", description: "Please describe your LEGO creation.", variant: "destructive" });
      return;
    }

    generateMutation.mutate({
      prompt,
      colors: selectedColors,
      size,
      complexity,
      theme,
      features,
    });
  };

  return (
    <div className="fade-in">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/menu")}
              data-testid="button-back"
            >
              <i className="fas fa-arrow-left text-muted-foreground"></i>
            </Button>
            <h1 className="font-semibold text-foreground">LEGO Creator</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Describe your LEGO creation</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 resize-none"
              placeholder="A spaceship with blue and silver colors, featuring angular designs and transparent cockpit windows..."
              data-testid="textarea-lego-description"
            />
          </div>

          {/* Design Specifications */}
          <div className="bg-muted rounded-xl p-4">
            <h3 className="font-semibold mb-4">Design Specifications</h3>
            
            {/* Color Palette */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Primary Colors</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    className={`w-8 h-8 rounded-full ${color.color} shadow-sm border-2 ${
                      selectedColors.includes(color.name) ? "border-primary scale-110" : "border-white"
                    } transition-all`}
                    data-testid={`color-${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size and Complexity */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select value={size} onValueChange={setSize} data-testid="select-size">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small (50-100 pieces)">Small (50-100 pieces)</SelectItem>
                    <SelectItem value="Medium (100-300 pieces)">Medium (100-300 pieces)</SelectItem>
                    <SelectItem value="Large (300+ pieces)">Large (300+ pieces)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Complexity</label>
                <Select value={complexity} onValueChange={setComplexity} data-testid="select-complexity">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((themeName) => (
                  <Button
                    key={themeName}
                    variant={theme === themeName ? "default" : "outline"}
                    onClick={() => setTheme(themeName)}
                    data-testid={`theme-${themeName.toLowerCase()}`}
                  >
                    {themeName}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div>
            <h3 className="font-semibold mb-3">Special Features</h3>
            <div className="space-y-2">
              {availableFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                    data-testid={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                  <label htmlFor={feature} className="text-sm">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
            data-testid="button-generate"
          >
            <i className="fas fa-cubes mr-2"></i>
            Create LEGO Design
          </Button>
        </div>
      </div>

      <LoadingModal
        isOpen={generateMutation.isPending}
        title="Designing LEGO creation..."
        message="Building your custom LEGO set"
      />

      <ResultModal
        isOpen={!!result}
        onClose={() => setResult(null)}
        result={result}
      />
    </div>
  );
}

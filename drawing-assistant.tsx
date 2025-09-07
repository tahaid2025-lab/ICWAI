import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateDrawing } from "@/lib/api";
import { LoadingModal } from "@/components/loading-modal";
import { ResultModal } from "@/components/result-modal";
import { useToast } from "@/hooks/use-toast";
import type { Creation } from "@shared/schema";

export default function DrawingAssistant() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"style-transfer" | "text-to-image">("style-transfer");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Van Gogh");
  const [quality, setQuality] = useState("High");
  const [dimensions, setDimensions] = useState("Square (1024x1024)");
  const [result, setResult] = useState<Creation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateDrawing,
    onSuccess: (creation) => {
      setResult(creation);
      queryClient.invalidateQueries({ queryKey: ["/api/creations"] });
      toast({ title: "Success", description: "Your artwork has been created!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate artwork. Please try again.", variant: "destructive" });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({ title: "Error", description: "Please enter a description for your artwork.", variant: "destructive" });
      return;
    }

    generateMutation.mutate({
      prompt,
      style,
      type: mode,
    });
  };

  const styles = ["Van Gogh", "Picasso", "Monet", "Realistic", "Digital Art", "Oil Painting", "Watercolor", "Sketch"];

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
            <h1 className="font-semibold text-foreground">Drawing Assistant</h1>
            <div></div>
          </div>
        </div>

        {/* Tool Selection */}
        <div className="p-4">
          <div className="flex space-x-3 mb-6">
            <Button
              onClick={() => setMode("style-transfer")}
              className={mode === "style-transfer" ? "" : "bg-muted text-muted-foreground"}
              data-testid="button-style-transfer"
            >
              <i className="fas fa-palette mr-2"></i>
              Style Transfer
            </Button>
            <Button
              onClick={() => setMode("text-to-image")}
              className={mode === "text-to-image" ? "" : "bg-muted text-muted-foreground"}
              data-testid="button-text-to-image"
            >
              <i className="fas fa-pen mr-2"></i>
              Text to Image
            </Button>
          </div>

          <div className="space-y-4">
            {mode === "style-transfer" && (
              <>
                {/* Image Upload Placeholder */}
                <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 text-center">
                  <i className="fas fa-cloud-upload-alt text-4xl text-muted-foreground mb-4"></i>
                  <p className="text-muted-foreground mb-2">Upload your photo or describe it</p>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your image for style transfer..."
                    className="mt-4"
                    data-testid="textarea-style-description"
                  />
                </div>

                {/* Style Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Choose Art Style</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {styles.slice(0, 6).map((styleName) => (
                      <div
                        key={styleName}
                        onClick={() => setStyle(styleName)}
                        className={`border-2 rounded-xl p-3 cursor-pointer ${
                          style === styleName ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        data-testid={`style-${styleName.toLowerCase().replace(" ", "-")}`}
                      >
                        <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mb-2"></div>
                        <p className="text-xs text-center font-medium">{styleName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === "text-to-image" && (
              <>
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Describe your image</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-24 resize-none"
                    placeholder="A beautiful sunset over mountains with vibrant colors..."
                    data-testid="textarea-image-description"
                  />
                </div>

                {/* Style Options */}
                <div>
                  <label className="block text-sm font-medium mb-2">Art Style</label>
                  <Select value={style} onValueChange={setStyle} data-testid="select-art-style">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((styleName) => (
                        <SelectItem key={styleName} value={styleName}>
                          {styleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Options */}
                <div className="bg-muted rounded-xl p-4">
                  <h4 className="font-medium mb-3">Advanced Options</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Quality</label>
                      <div className="flex space-x-2">
                        {["High", "Medium", "Fast"].map((q) => (
                          <Button
                            key={q}
                            variant={quality === q ? "default" : "outline"}
                            size="sm"
                            onClick={() => setQuality(q)}
                            data-testid={`quality-${q.toLowerCase()}`}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Dimensions</label>
                      <Select value={dimensions} onValueChange={setDimensions} data-testid="select-dimensions">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Square (1024x1024)">Square (1024x1024)</SelectItem>
                          <SelectItem value="Portrait (768x1024)">Portrait (768x1024)</SelectItem>
                          <SelectItem value="Landscape (1024x768)">Landscape (1024x768)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-2xl font-semibold shadow-lg"
              data-testid="button-generate"
            >
              <i className={`${mode === "text-to-image" ? "fas fa-wand-magic-sparkles" : "fas fa-magic"} mr-2`}></i>
              {mode === "text-to-image" ? "Generate Image" : "Transform Image"}
            </Button>
          </div>
        </div>
      </div>

      <LoadingModal
        isOpen={generateMutation.isPending}
        title="Creating your artwork..."
        message="This may take a few moments"
      />

      <ResultModal
        isOpen={!!result}
        onClose={() => setResult(null)}
        result={result}
      />
    </div>
  );
}

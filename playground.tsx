import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePlayground } from "@/lib/api";
import { LoadingModal } from "@/components/loading-modal";
import { ResultModal } from "@/components/result-modal";
import { useToast } from "@/hooks/use-toast";
import type { Creation } from "@shared/schema";

export default function Playground() {
  const [, setLocation] = useLocation();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState("gradient1");
  const [selectedStyle, setSelectedStyle] = useState("Magical");
  const [emojiCategory, setEmojiCategory] = useState("Popular");
  const [result, setResult] = useState<Creation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const emojiCategories = {
    Popular: ["😀", "🚀", "🌟", "🎨", "🦄", "🌈", "🔥", "💎", "🎭", "🌸", "⚡", "🍀", "🌙", "☀️", "🌊", "🎪"],
    Nature: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌿", "🍀", "🌳", "🌲", "🌴", "🌵", "🌾", "🌙", "⭐", "☀️", "🌊"],
    Objects: ["🎨", "🎭", "🎪", "🎨", "🖌️", "✏️", "🖊️", "📝", "📚", "🔮", "💎", "⚡", "🔥", "💫", "✨", "🎆"],
    Animals: ["🦄", "🐱", "🐶", "🐰", "🐸", "🦋", "🐝", "🐠", "🐙", "🦄", "🐣", "🦉", "🐨", "🐼", "🦁", "🐯"],
  };

  const backgrounds = [
    { id: "gradient1", class: "bg-gradient-to-br from-purple-400 to-pink-400" },
    { id: "gradient2", class: "bg-gradient-to-br from-blue-400 to-green-400" },
    { id: "gradient3", class: "bg-gradient-to-br from-orange-400 to-red-400" },
    { id: "gradient4", class: "bg-gradient-to-br from-teal-400 to-blue-400" },
    { id: "gradient5", class: "bg-gradient-to-br from-pink-400 to-yellow-400" },
    { id: "solid", class: "bg-gray-100" },
  ];

  const styles = [
    { name: "Magical", icon: "fas fa-sparkles" },
    { name: "Artistic", icon: "fas fa-brush" },
    { name: "Dynamic", icon: "fas fa-bolt" },
    { name: "Dreamy", icon: "fas fa-heart" },
  ];

  const generateMutation = useMutation({
    mutationFn: generatePlayground,
    onSuccess: (creation) => {
      setResult(creation);
      queryClient.invalidateQueries({ queryKey: ["/api/creations"] });
      toast({ title: "Success", description: "Your playground artwork has been created!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate artwork. Please try again.", variant: "destructive" });
    },
  });

  const addEmoji = (emoji: string) => {
    if (selectedEmojis.length < 5 && !selectedEmojis.includes(emoji)) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const removeEmoji = (index: number) => {
    setSelectedEmojis(selectedEmojis.filter((_, i) => i !== index));
  };

  const clearEmojis = () => {
    setSelectedEmojis([]);
  };

  const handleGenerate = () => {
    if (selectedEmojis.length === 0) {
      toast({ title: "Error", description: "Please select at least one emoji.", variant: "destructive" });
      return;
    }

    generateMutation.mutate({
      emojis: selectedEmojis,
      background: selectedBackground,
      style: selectedStyle,
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
            <h1 className="font-semibold text-foreground">Playground</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearEmojis}
              data-testid="button-clear"
            >
              <i className="fas fa-trash text-muted-foreground"></i>
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Canvas Preview */}
          <div 
            className={`rounded-2xl p-8 text-center border-2 border-dashed border-border min-h-48 flex flex-col items-center justify-center ${
              backgrounds.find(b => b.id === selectedBackground)?.class || "bg-gradient-to-br from-pink-100 to-blue-100"
            }`}
            data-testid="canvas-preview"
          >
            <div className="text-4xl mb-4" data-testid="selected-emojis">
              {selectedEmojis.join(" ") || "🚀✨🌟"}
            </div>
            <p className="text-muted-foreground text-sm">
              {selectedEmojis.length > 0 ? "Your creation will appear here" : "Select emojis to get started"}
            </p>
          </div>

          {/* Selected Emojis Management */}
          {selectedEmojis.length > 0 && (
            <div className="bg-muted rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Selected Emojis ({selectedEmojis.length}/5)</h3>
                <Button variant="ghost" size="sm" onClick={clearEmojis} data-testid="button-clear-selected">
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => removeEmoji(index)}
                    className="text-2xl p-2 rounded-lg bg-background hover:bg-red-100 transition-colors"
                    data-testid={`selected-emoji-${index}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emoji Selection */}
          <div>
            <h3 className="font-semibold mb-3">Choose Emojis</h3>
            <div className="bg-muted rounded-xl p-4">
              <div className="grid grid-cols-8 gap-2 mb-4">
                {emojiCategories[emojiCategory as keyof typeof emojiCategories].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className={`text-2xl p-2 rounded-lg hover:bg-background transition-colors ${
                      selectedEmojis.includes(emoji) ? "bg-primary/20 ring-2 ring-primary" : ""
                    }`}
                    data-testid={`emoji-${index}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                {Object.keys(emojiCategories).map((category) => (
                  <Button
                    key={category}
                    variant={emojiCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEmojiCategory(category)}
                    data-testid={`category-${category.toLowerCase()}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Background Selection */}
          <div>
            <h3 className="font-semibold mb-3">Choose Background</h3>
            <div className="grid grid-cols-3 gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`aspect-square rounded-xl border-2 ${bg.class} ${
                    selectedBackground === bg.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                  } flex items-center justify-center`}
                  data-testid={`background-${bg.id}`}
                >
                  {bg.id === "solid" && <i className="fas fa-palette text-gray-400"></i>}
                </button>
              ))}
            </div>
          </div>

          {/* Style Options */}
          <div>
            <h3 className="font-semibold mb-3">Style Effects</h3>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <Button
                  key={style.name}
                  variant={selectedStyle === style.name ? "default" : "outline"}
                  onClick={() => setSelectedStyle(style.name)}
                  data-testid={`style-${style.name.toLowerCase()}`}
                >
                  <i className={`${style.icon} mr-2`}></i>
                  {style.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || selectedEmojis.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
            data-testid="button-generate"
          >
            <i className="fas fa-magic mr-2"></i>
            Create Artwork
          </Button>
        </div>
      </div>

      <LoadingModal
        isOpen={generateMutation.isPending}
        title="Creating magical artwork..."
        message="Combining emojis and backgrounds"
      />

      <ResultModal
        isOpen={!!result}
        onClose={() => setResult(null)}
        result={result}
      />
    </div>
  );
}

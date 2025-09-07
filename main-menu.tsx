import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Creation } from "@shared/schema";

export default function MainMenu() {
  const [, setLocation] = useLocation();

  const { data: recentCreations = [] } = useQuery<Creation[]>({
    queryKey: ["/api/creations"],
  });

  const recent = recentCreations.slice(0, 3);

  return (
    <div className="fade-in">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="app-title">ICWAI</h1>
            <p className="text-muted-foreground text-sm">Choose your creative tool</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation("/gallery")}
              data-testid="button-gallery"
            >
              <i className="fas fa-images text-muted-foreground"></i>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* Drawing Assistant Card */}
          <div 
            onClick={() => setLocation("/drawing")}
            className="gradient-card rounded-3xl p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-102 active:scale-98 shadow-xl"
            data-testid="card-drawing-assistant"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Drawing Assistant</h3>
                <p className="text-white/80 text-sm">Samsung-style AI art creation</p>
              </div>
              <i className="fas fa-paintbrush text-3xl opacity-80"></i>
            </div>
            <div className="text-white/90 text-sm">
              Transform photos with artistic styles and create images from text descriptions.
            </div>
          </div>

          {/* LEGO Creator Card */}
          <div 
            onClick={() => setLocation("/lego")}
            className="gradient-lego rounded-3xl p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-102 active:scale-98 shadow-xl"
            data-testid="card-lego-creator"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">LEGO Creator</h3>
                <p className="text-white/80 text-sm">Custom LEGO design generator</p>
              </div>
              <i className="fas fa-cubes text-3xl opacity-80"></i>
            </div>
            <div className="text-white/90 text-sm">
              Describe your vision and watch AI create unique LEGO designs with custom colors and shapes.
            </div>
          </div>

          {/* Playground Card */}
          <div 
            onClick={() => setLocation("/playground")}
            className="gradient-playground rounded-3xl p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-102 active:scale-98 shadow-xl"
            data-testid="card-playground"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Playground</h3>
                <p className="text-white/80 text-sm">Apple-style emoji combinations</p>
              </div>
              <i className="fas fa-smile text-3xl opacity-80"></i>
            </div>
            <div className="text-white/90 text-sm">
              Combine emojis and backgrounds to create whimsical, unique artworks.
            </div>
          </div>
        </div>

        {/* Recent Creations Preview */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Creations</h3>
            <Button
              variant="ghost"
              onClick={() => setLocation("/gallery")}
              className="text-primary text-sm font-medium"
              data-testid="button-view-all"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recent.map((creation, index) => (
              <div
                key={creation.id}
                className="aspect-square bg-cover bg-center rounded-xl"
                style={{ backgroundImage: `url(${creation.imageUrl})` }}
                data-testid={`thumbnail-recent-${index}`}
              />
            ))}
            {recent.length < 3 && (
              <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
                <i className="fas fa-plus text-muted-foreground text-xl"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

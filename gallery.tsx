import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCreation, downloadImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Creation } from "@shared/schema";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("All");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allCreations = [], isLoading } = useQuery<Creation[]>({
    queryKey: ["/api/creations"],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCreation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creations"] });
      toast({ title: "Success", description: "Image deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete image.", variant: "destructive" });
    },
  });

  const filteredCreations = allCreations.filter(creation => {
    if (filter === "All") return true;
    return creation.type === filter.toLowerCase();
  });

  const handleDelete = (creation: Creation) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      deleteMutation.mutate(creation.id);
    }
  };

  const handleDownload = async (creation: Creation) => {
    try {
      await downloadImage(creation.imageUrl, `${creation.title || "creation"}.png`);
      toast({ title: "Success", description: "Image downloaded successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download image.", variant: "destructive" });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "drawing":
        return "Drawing Assistant";
      case "lego":
        return "LEGO Creator";
      case "playground":
        return "Playground";
      default:
        return type;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
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
            <h1 className="font-semibold text-foreground">My Gallery</h1>
            <div></div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            {["All", "Drawing", "LEGO", "Playground"].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption)}
                data-testid={`filter-${filterOption.toLowerCase()}`}
              >
                {filterOption}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your creations...</p>
            </div>
          ) : filteredCreations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4" data-testid="gallery-grid">
              {filteredCreations.map((creation, index) => (
                <div key={creation.id} className="relative group">
                  <div 
                    className="aspect-square bg-cover bg-center rounded-xl overflow-hidden"
                    style={{ backgroundImage: `url(${creation.imageUrl})` }}
                    data-testid={`image-${index}`}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-active:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(creation)}
                      className="p-3 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/30"
                      data-testid={`button-download-${index}`}
                    >
                      <i className="fas fa-download"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(creation)}
                      className="p-3 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/30"
                      data-testid={`button-delete-${index}`}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(creation.type)} • {getTimeAgo(creation.createdAt)}
                    </p>
                    {creation.title && (
                      <p className="text-xs font-medium text-foreground truncate">
                        {creation.title}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16" data-testid="empty-gallery">
              <i className="fas fa-images text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-lg font-semibold mb-2">
                {filter === "All" ? "No creations yet" : `No ${filter.toLowerCase()} creations yet`}
              </h3>
              <p className="text-muted-foreground mb-6">
                Start creating amazing AI artwork!
              </p>
              <Button
                onClick={() => setLocation("/menu")}
                data-testid="button-create-first"
              >
                Create Your First Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Creation } from "@shared/schema";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Creation | null;
}

export function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  const { toast } = useToast();

  if (!isOpen || !result) return null;

  const handleDownload = async () => {
    try {
      await downloadImage(result.imageUrl, `${result.title || "creation"}.png`);
      toast({ title: "Success", description: "Image downloaded successfully!" });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to download image.", variant: "destructive" });
    }
  };

  const handleSave = () => {
    // Already saved when generated
    toast({ title: "Success", description: "Image saved to gallery!" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal-backdrop absolute inset-0" onClick={onClose}></div>
      <div className="bg-card rounded-2xl p-6 mx-4 relative z-10 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" data-testid="result-title">Your Creation</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close"
          >
            <i className="fas fa-times text-muted-foreground"></i>
          </Button>
        </div>
        
        <div className="mb-4">
          <div 
            className="aspect-square bg-cover bg-center rounded-xl"
            style={{ backgroundImage: `url(${result.imageUrl})` }}
            data-testid="result-image"
          />
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleDownload}
            className="flex-1"
            data-testid="button-download"
          >
            <i className="fas fa-download mr-2"></i>
            Download
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex-1"
            data-testid="button-save"
          >
            <i className="fas fa-save mr-2"></i>
            Saved
          </Button>
        </div>
      </div>
    </div>
  );
}

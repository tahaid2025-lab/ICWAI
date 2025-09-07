interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  message: string;
}

export function LoadingModal({ isOpen, title, message }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal-backdrop absolute inset-0"></div>
      <div className="bg-card rounded-2xl p-8 mx-4 relative z-10 text-center max-w-sm w-full">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h3 className="font-semibold mb-2" data-testid="loading-title">{title}</h3>
        <p className="text-muted-foreground text-sm" data-testid="loading-message">{message}</p>
      </div>
    </div>
  );
}

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface ApiErrorProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export function ApiError({ 
  message = "We encountered an error while connecting to our servers. Please try again.", 
  onRetry, 
  title = "Connection Error"
}: ApiErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="default"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

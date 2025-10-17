import { Link } from "wouter";
import { FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-foreground">404 Page Not Found</h1>
          <p className="text-base text-muted-foreground">Could not find requested resource</p>
        </div>
        <Link href="/">
          <button 
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover-elevate active-elevate-2 transition-all duration-150"
            data-testid="button-home"
          >
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}

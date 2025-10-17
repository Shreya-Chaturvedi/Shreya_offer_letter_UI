import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Alert({ type, message, onClose, duration = 5000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 10);

    // Progress bar animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 16);

    // Auto dismiss
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  const colors = {
    success: {
      bg: 'bg-chart-2/10',
      border: 'border-chart-2',
      icon: 'text-chart-2',
      progress: 'bg-chart-2'
    },
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive',
      icon: 'text-destructive',
      progress: 'bg-destructive'
    }
  };

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-md transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
      data-testid={`alert-${type}`}
    >
      <div
        className={`rounded-lg ${colors[type].bg} border-l-4 ${colors[type].border} p-4 shadow-lg overflow-hidden`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${colors[type].icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground" data-testid={`alert-message-${type}`}>
              {message}
            </p>
          </div>
        </div>
        <div className="mt-2 h-1 bg-border/20 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors[type].progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

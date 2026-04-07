// src/components/ui/ErrorMessage.tsx
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface ErrorMessageProps {
  error: unknown;
  // Legacy prop - kept for backward compatibility
  onRetry?: () => void;
  // New props
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  title?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry, // Legacy prop
  primaryAction,
  secondaryAction,
  title = "Something went wrong",
  className = "",
}) => {
  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred. Please try again.";
  };

  const errorMessage = getErrorMessage(error);

  // Backward compatibility: if onRetry is provided but no primaryAction,
  // create a primaryAction from onRetry
  const resolvedPrimaryAction =
    primaryAction ||
    (onRetry
      ? {
          label: "Try again",
          onClick: onRetry,
          icon: (
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
          ),
        }
      : undefined);

  return (
    <div
      className={`container mx-auto max-w-5xl flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      {/* Icon with subtle animation */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-destructive/10 rounded-full blur-xl opacity-30"></div>
        <div className="relative bg-linear-to-br from-destructive/5 to-destructive/10 p-4 rounded-2xl border border-destructive/20">
          <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md space-y-3">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {errorMessage}
        </p>
      </div>

      {/* Action buttons */}
      {(resolvedPrimaryAction || secondaryAction) && (
        <div className="mt-8 flex items-center gap-3">
          {/* Primary action button */}
          {resolvedPrimaryAction && (
            <button
              onClick={resolvedPrimaryAction.onClick}
              className="group hover:cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/90 active:bg-foreground/95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              {resolvedPrimaryAction.icon || (
                <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
              )}
              {resolvedPrimaryAction.label}
            </button>
          )}

          {/* Secondary action button */}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="hover:cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/80 active:bg-muted/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;

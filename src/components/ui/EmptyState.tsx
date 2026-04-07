// src/components/ui/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FileText, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  onCreateClick?: () => void;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  showCreateButton?: boolean;
}

export function EmptyState({
  onCreateClick,
  icon: Icon = FileText,
  title = "No Content Yet",
  description = "Get started by creating your first item. You can manage and track everything in one place.",
  buttonText = "Create New",
  buttonIcon: ButtonIcon,
  showCreateButton = true,
}: EmptyStateProps) {
  const shouldShowButton = showCreateButton && onCreateClick;

  return (
    <div className="flex flex-col items-center justify-center min-h-75 space-y-6">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        {shouldShowButton && (
          <Button onClick={onCreateClick} size="lg">
            {ButtonIcon && <ButtonIcon className="h-5 w-5" />}
            {buttonText}
          </Button>
        )}
      </CardContent>
    </div>
  );
}

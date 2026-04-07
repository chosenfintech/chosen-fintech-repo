// src/components/posts/categories/detail/Header.tsx
import { format } from "date-fns";
import {
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryDetailHeaderProps {
  categoryName: string;
  publishedPostsCount: number;
  unpublishedPostsCount: number;
  totalPostsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  onEdit: () => void;
}

export default function CategoryDetailHeader({
  categoryName,
  publishedPostsCount,
  unpublishedPostsCount,
  totalPostsCount,
  createdAt,
  updatedAt,
  onEdit,
}: CategoryDetailHeaderProps) {
  return (
    <div className="bg-gradient-hero rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-lg mb-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Main content section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight wrap-break-word">
                {categoryName}
              </h1>
              <p className="text-white/80 text-base sm:text-lg font-medium mt-1">
                Category Management
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            {/* Published Posts */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 p-4 hover:bg-white/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    Published
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {publishedPostsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Draft Posts */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 p-4 hover:bg-white/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-yellow-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    Drafts
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {unpublishedPostsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Posts */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 p-4 hover:bg-white/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-100" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    Total Posts
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {totalPostsCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions and metadata section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="order-2 sm:order-1 flex flex-col sm:flex-row gap-2 text-xs sm:text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                Created: {format(new Date(createdAt), "MMM dd, yyyy")}
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                Updated: {format(new Date(updatedAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          <div className="order-1 sm:order-2 w-full sm:w-auto">
            <Button
              onClick={onEdit}
              variant="secondary"
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 transition-all duration-200"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Category
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

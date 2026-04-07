// src/components/posts/detail/ShareMenu.tsx
"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share2, Copy, Twitter, Linkedin, Facebook, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface ShareMenuProps {
  postTitle: string;
  variant?: "default" | "icon-only";
}

export const ShareMenu: React.FC<ShareMenuProps> = ({
  postTitle,
  variant = "default",
}) => {
  const [value, setValue] = useState<string>("");

  const shareOptions = [
    {
      name: "Copy Link",
      value: "copy",
      icon: Copy,
      color: "text-muted-foreground",
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to copy link");
        }
      },
    },
    {
      name: "Twitter",
      value: "twitter",
      icon: Twitter,
      color: "text-blue-500",
      action: () => {
        const text = encodeURIComponent(
          `${postTitle}\n\n${window.location.href}`,
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${text}`,
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    {
      name: "LinkedIn",
      value: "linkedin",
      icon: Linkedin,
      color: "text-blue-700",
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    {
      name: "Facebook",
      value: "facebook",
      icon: Facebook,
      color: "text-blue-600",
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    {
      name: "Email",
      value: "email",
      icon: Mail,
      color: "text-green-600",
      action: () => {
        const subject = encodeURIComponent(
          `Check out this article: ${postTitle}`,
        );
        const body = encodeURIComponent(
          `I thought you might be interested in this article:\n\n${postTitle}\n${window.location.href}`,
        );
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
    },
  ];

  const handleValueChange = (newValue: string) => {
    const option = shareOptions.find((opt) => opt.value === newValue);
    if (option) {
      option.action();
      // Reset the select after action
      setTimeout(() => setValue(""), 100);
    }
  };

  if (variant === "icon-only") {
    return (
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger
          className="rounded-xl flex-1 cursor-pointer"
          aria-label="Share Article"
        >
          <div className="flex items-center">
            <Share2 className="h-5 w-5" />
            <span className="ml-2">Share</span>
          </div>
        </SelectTrigger>
        <SelectContent className="w-64">
          {shareOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <option.icon
                  className={`h-5 w-5 ${option.color} transition-transform shrink-0`}
                />
                <span className="font-medium text-sm">{option.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="rounded-xl w-full h-11 cursor-pointer">
        <div className="flex items-center">
          <Share2 className="h-5 w-5 mr-3" />
          <SelectValue placeholder="Share Article" />
        </div>
      </SelectTrigger>
      <SelectContent className="w-64">
        {shareOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <option.icon
                className={`h-5 w-5 ${option.color} transition-transform shrink-0`}
              />
              <span className="font-medium text-sm">{option.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

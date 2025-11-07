// utility functions for classnames and formatting

import type { Company } from "@/types/company";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// format the loacation for display based on whats available
export const formatLocation = (location: Company["location"]): string => {
  if (typeof location === "string") return location;
  if (location?.city && location?.country) {
    return `${location.city}, ${location.country}`;
  }
  return location?.raw_location || "N/A";
};

// format the industry for display
export const formatIndustry = (industry: Company["industry"]): string => {
  if (!industry) return "N/A";
  if (typeof industry === "string") return industry;
  return industry!.primary! || "N/A";
};

// format date
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

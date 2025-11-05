"use client";
import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { CompanyFilters } from "@/types/company";

interface FiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  onClearFilters: () => void;
  locations: string[];
  industries: string[];
}

function Filters({
  filters,
  onFiltersChange,
  onClearFilters,
  locations,
  industries,
}: FiltersProps) {
  const hasActiveFilters =
    filters.search || filters.location || filters.industry;

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.location}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, location: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.industry}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, industry: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Filters;

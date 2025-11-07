/**
 * QuickActions component provides UI controls for filtering, viewing, and adding companies.
 *
 * @param setFilters - Function to update the current filters.
 * @param clearFilters - Optional function to clear all filters.
 * @param filters - Current filter values.
 * @param viewMode - Current view mode ("table" or "grid").
 * @param setViewMode - Function to update the view mode.
 * @param onAdd - Function to handle adding a new company.
 *
 * Displays filter controls, company count, view mode toggles, and an add company dialog.
 */
"use-client";
import React from "react";
import { useCompanies } from "@/hooks/useCompanies";
import Filters from "./filters";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, LayoutGrid } from "lucide-react";
import type { Company, ViewMode, CompanyFilters } from "@/types/company";
import { CompanyFormDialog } from "./addCompany";

interface QuickActionsProps {
  setFilters: (filters: any) => void;
  clearFilters?: () => void;
  filters?: any;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAdd: (
    company: Omit<Company, "id" | "created_at">,
  ) => Promise<Company | undefined>;
}

function QuickActions({
  setFilters,
  clearFilters,
  filters,
  viewMode,
  setViewMode,
}: QuickActionsProps) {
  const { companies, locations, industries, isLoading, addCompany } =
    useCompanies();

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters!}
            locations={locations}
            industries={industries}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading companies...
              </span>
            ) : (
              <span>
                Showing{" "}
                <span className="text-foreground font-semibold">
                  {companies.length}
                </span>{" "}
                {companies.length === 1 ? "company" : "companies"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-background flex items-center rounded-lg border p-1">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <Table className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Grid
              </Button>
            </div>
            {/* add company box */}
            <CompanyFormDialog onAdd={addCompany} />
          </div>
        </div>
      </div>
    </>
  );
}

export default QuickActions;

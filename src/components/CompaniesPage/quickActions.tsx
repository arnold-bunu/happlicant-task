"use-client";
import React, { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import Filters from "./filters";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, LayoutGrid } from "lucide-react";
import type { ViewMode } from "@/types/company";

function QuickActions() {
  const {
    companies,
    filters,
    setFilters,
    clearFilters,
    locations,
    industries,
    isLoading,
    addCompany,
    deleteCompany,
  } = useCompanies();
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
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

            {/* <CompanyFormDialog onAdd={addCompany} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default QuickActions;

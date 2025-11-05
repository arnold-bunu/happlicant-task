"use client";
import QuickActions from "@/components/CompaniesPage/quickActions";
import { CompanyTable } from "@/components/CompaniesPage/table";
import { useCompanies } from "@/hooks/useCompanies";
import { Loader2, Building2 } from "lucide-react";
import React, { useState } from "react";
import type { ViewMode } from "@/types/company"
import { CompanyCardGrid } from "@/components/CompaniesPage/grid";

function CompaniesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [companyToDelete, setCompanyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { companies, isLoading, setFilters, clearFilters, filters  } = useCompanies();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    setCompanyToDelete({ id, name });
    setDeleteDialogOpen(true);
  };
  return (
    <>
      <div className="bg-background p-5">
        <QuickActions 
          setFilters={setFilters}
          clearFilters={clearFilters}
          filters={filters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {filters.search || filters.location || filters.industry
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first company."}
              </p>
              {/* {!filters.search && !filters.location && !filters.industry && <CompanyFormDialog onAdd={addCompany} />} */}
            </div>
            ): viewMode === "table" ? (
          <CompanyTable
            onDelete={(id) => {
              const company = companies.find((c) => c.id === id);
              if (company) {
                handleDelete(company.id, company.name);
              }
            }}
            companies={companies}
          />
        ) : (
          <CompanyCardGrid
               onDelete={(id) => {
              const company = companies.find((c) => c.id === id);
              if (company) {
                handleDelete(company.id, company.name);
              }
            }}
            companies={companies}
          />
        )
        }
      </div>
    </>
  );
}

export default CompaniesPage;

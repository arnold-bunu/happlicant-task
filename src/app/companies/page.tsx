"use client";
import QuickActions from "@/components/CompaniesPage/quickActions";
import { CompanyTable } from "@/components/CompaniesPage/table";
import { useCompanies } from "@/hooks/useCompanies";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

function CompaniesPage() {
  const [companyToDelete, setCompanyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { companies, isLoading, setFilters, clearFilters } = useCompanies();
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
          filters={{}}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : (
          <CompanyTable
            onDelete={(id) => {
              const company = companies.find((c) => c.id === id);
              if (company) {
                handleDelete(company.id, company.name);
              }
            }}
            companies={companies}
          />
        )}
      </div>
    </>
  );
}

export default CompaniesPage;

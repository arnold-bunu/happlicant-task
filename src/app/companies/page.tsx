"use client";
import { useState, useEffect } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import CompanyFilters from "@/components/CompaniesPage/filters";
import { CompanyTable } from "@/components/CompaniesPage/table";
import { CompanyCardGrid } from "@/components/CompaniesPage/grid";
import { CompanyFormDialog } from "@/components/CompaniesPage/addCompany";
import { EditCompanyDialog } from "@/components/CompaniesPage/editCompany";
import { DeleteDialog } from "@/components/CompaniesPage/deleteCompany";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table, Building2, Loader2 } from "lucide-react";
import type { ViewMode, Company } from "@/types/company";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Header } from "@/components/Global/header";

export default function CompaniesPage() {
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
    updateCompany,
  } = useCompanies();

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("viewMode") as ViewMode) || "table";
    }
    return "table";
  });
  const [hydrated, setHydrated] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  const handleDelete = (id: string, name: string) => {
    setCompanyToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete.id);
      toast.success("Company deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete company. Please try again.");
    } finally {
      setCompanyToDelete(null);
    }
  };

  const handleEdit = (company: Company) => {
    setCompanyToEdit(company);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (id: string, updates: Partial<Company>) => {
    await updateCompany(id, updates);
  };

  useEffect(() => {
    const saved = localStorage.getItem("viewMode") as ViewMode | null;
    if (saved) setViewMode(saved);
    setHydrated(true);
  }, []);

  // Save whenever viewMode changes (but only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode, hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="bg-background flex h-screen flex-col">
      <Header />
      <div className="mx-auto flex flex-1 flex-col overflow-hidden px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex-shrink-0"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Building2 className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Company Management
              </h1>
              <p className="text-muted-foreground">
                Manage and organize your company portfolio
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex-shrink-0 space-y-4"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <CompanyFilters
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

              <CompanyFormDialog onAdd={addCompany} />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <Building2 className="text-muted-foreground h-10 w-10" />
              </div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                No companies found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {filters.search || filters.location || filters.industry
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first company."}
              </p>
              {!filters.search && !filters.location && !filters.industry && (
                <CompanyFormDialog onAdd={addCompany} />
              )}
            </div>
          ) : viewMode === "table" ? (
            <CompanyTable
              companies={companies}
              onDelete={(id) => {
                const company = companies.find((c) => c.id === id);
                if (company) handleDelete(id, company.name);
              }}
              onEdit={handleEdit}
            />
          ) : (
            <CompanyCardGrid
              companies={companies}
              onDelete={(id) => {
                const company = companies.find((c) => c.id === id);
                if (company) handleDelete(id, company.name);
              }}
              onEdit={handleEdit}
            />
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        companyName={companyToDelete?.name || ""}
      />

      {/* Edit Company Dialog */}
      <EditCompanyDialog
        company={companyToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleEditSubmit}
      />
    </div>
  );
}

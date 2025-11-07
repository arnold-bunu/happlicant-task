/**
 * Renders a table displaying a list of companies with their details.
 *
 * @param companies - Array of company objects to display in the table.
 * @param onDelete - Callback function invoked when a company is deleted.
 * @param onEdit - Callback function invoked when a company is edited.
 *
 * Displays columns for company name, location, industry, number of employees, founding year, creation date, and actions.
 */
"use client";
import React from "react";
import type { Company } from "@/types/company";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TableContent from "./tableContent";

interface CompanyTableProps {
  companies?: Company[];
  onDelete: (id: string) => void;
  onEdit?: (company: Company) => void;
}

export function CompanyTable({
  companies,
  onDelete,
  onEdit,
}: CompanyTableProps) {
  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Founded</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableContent
          companies={companies}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </Table>
    </div>
  );
}

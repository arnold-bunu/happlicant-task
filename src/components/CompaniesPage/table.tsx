"use client";
import React, { useEffect } from "react";
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
  useEffect(() => {
    console.log("Companies in Table:", companies);
  }, [companies]);

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

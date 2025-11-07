/**
 * Renders the table body content for a list of companies, displaying details such as logo, name, website, location, etc.
 * Provides edit and delete actions for each company row.
 *
 * @param companies - Array of company objects to display in the table.
 * @param onDelete - Callback function invoked when the delete button is clicked, receives the company ID.
 * @param onEdit - Optional callback function invoked when the edit button is clicked, receives the company object.
 *
 * @returns TableBody element containing animated table rows for each company.
 */

"use client";
import { motion } from "framer-motion";
import { TableBody, TableCell } from "@/components/ui/table";
import { ExternalLink, Building2, Trash2, PenSquareIcon } from "lucide-react";
import CompanyLogo from "./companyLogo";
import type { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { formatLocation, formatIndustry, formatDate } from "@/lib/utils";

interface TableContentProps {
  companies?: Company[];
  onDelete: (id: string) => void;
  onEdit?: (company: Company) => void;
}

function TableContent({ companies, onDelete, onEdit }: TableContentProps) {
  return (
    <TableBody>
      {companies?.map((company, index) => (
        <motion.tr
          key={company.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group"
        >
          <TableCell className="font-medium">
            <div className="flex items-center gap-3">
              <div className="bg-muted relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
                <CompanyLogo
                  logo={company.logo_url ?? ""}
                  name={company.name ?? "No Logo"}
                />
                <Building2 className="text-muted-foreground hidden h-5 w-5" />
              </div>
              <div>
                <div className="text-foreground font-semibold">
                  {company?.name}
                </div>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
                >
                  {company?.website?.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </TableCell>
          <TableCell>{formatLocation(company?.location)}</TableCell>
          <TableCell>{formatIndustry(company?.industry)}</TableCell>
          <TableCell>{company?.employee_count?.toLocaleString()}</TableCell>
          <TableCell>{company.founded}</TableCell>
          <TableCell className="text-muted-foreground">
            {formatDate(company.created_at)}
          </TableCell>
          <TableCell className="text-right">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(company)}
              >
                <PenSquareIcon className="text-primary h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(company.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </TableCell>
        </motion.tr>
      ))}
    </TableBody>
  );
}

export default TableContent;

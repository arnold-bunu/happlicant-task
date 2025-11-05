"use client";
import React, { use, useEffect } from "react";
import type { Company } from "@/types/company";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCompanies } from "@/hooks/useCompanies";
interface CompanyTableProps {
  companies?: Company[];
  onDelete: (id: string) => void;
}

export function CompanyTable({ companies, onDelete }: CompanyTableProps) {
  const formatLocation = (location: Company["location"]) => {
    if (typeof location === "string") return location;
    if (location?.city && location?.country) {
      return `${location.city}, ${location.country}`;
    }
    return location?.raw_location || "N/A";
  };

  const formatIndustry = (industry: Company["industry"]) => {
    if (typeof industry === "string") return industry;
    return industry?.primary;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                    {company.logo_url ? (
                      <Image
                        src={`${company?.logo_url}` || "/placeholder.svg"}
                        alt={company.name}
                        width={40}
                        height={40}
                        className="object-contain"
                        unoptimized
                      />
                    ) : null}
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
      </Table>
    </div>
  );
}

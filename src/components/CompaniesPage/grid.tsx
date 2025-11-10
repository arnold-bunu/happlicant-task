/**
 * Renders a responsive grid of company cards.
 *
 * Each card displays company information including logo, name, website, description,
 * location, industry, employee count, and founding year. Cards also provide edit and delete
 * actions via buttons that appear on hover.
 *
 * @param companies - Array of company objects to display.
 * @param onDelete - Callback invoked when the delete button is clicked, receives the company ID.
 * @param onEdit - Optional callback invoked when the edit button is clicked, receives the company object.
 *
 * @returns A grid layout of animated company cards.
 */

"use client";
import type { Company } from "@/types/company";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  Building2,
  PenSquareIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import CompanyLogo from "./companyLogo";
import { formatLocation, formatIndustry } from "@/lib/utils";

interface CompanyCardGridProps {
  companies: Company[];
  onDelete: (id: string) => void;
  onEdit?: (company: Company) => void;
}

export function CompanyCardGrid({
  companies,
  onDelete,
  onEdit,
}: CompanyCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company, index) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => (window.location.href = `/companies/${company.id}`)}
          className="cursor-pointer"
        >
          <Card className="group flex h-full flex-col transition-shadow hover:shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="bg-muted relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl">
                  <CompanyLogo
                    logo={company.logo_url ?? ""}
                    name={company.name ?? "No Logo"}
                  />
                  <Building2 className="text-muted-foreground hidden h-7 w-7" />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(company);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <PenSquareIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(company.id);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-foreground text-lg leading-tight font-semibold">
                  {company.name}
                </h3>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 text-sm transition-colors"
                >
                  {company?.website?.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {company.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">
                    {formatLocation(company.location)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">
                    {formatIndustry(company.industry)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">
                    {company?.employee_count?.toLocaleString()} employees
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">
                    Founded {company.founded}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

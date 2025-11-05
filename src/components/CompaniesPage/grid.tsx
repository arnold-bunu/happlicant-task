"use client"

import type { Company } from "@/types/company"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, MapPin, Users, Calendar, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface CompanyCardGridProps {
  companies: Company[]
  onDelete: (id: string) => void
}

export function CompanyCardGrid({ companies, onDelete }: CompanyCardGridProps) {
  const formatLocation = (location: Company["location"]) => {
    if (typeof location === "string") return location;
    if (location?.city && location?.country) {
      return `${location.city}, ${location.country}`;
    }
    return location?.raw_location || "N/A";
  };
  const formatIndustry = (industry: Company["industry"]) => {
    if (typeof industry === "string") return industry
    return industry?.primary
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company, index) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="relative h-14 w-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  {company.logo_url ? (
                    <Image
                      src={company.logo_url || "/placeholder.svg"}
                      alt={company.name}
                      width={56}
                      height={56}
                      className="object-contain"
                    unoptimized
                    />
                  ) : null}
                  <Building2 className="h-7 w-7 text-muted-foreground hidden" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(company.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-foreground leading-tight">{company.name}</h3>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-1 transition-colors"
                >
                  {company?.website?.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{company.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{formatLocation(company.location)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{formatIndustry(company.industry)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{company?.employee_count?.toLocaleString()} employees</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Founded {company.founded}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

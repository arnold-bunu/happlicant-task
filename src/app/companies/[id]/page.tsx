"use client";

import { useParams, useRouter } from "next/navigation";
import { useCompany } from "@/hooks/useCompany";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  MapPin,
  Users,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { formatLocation } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import CompanyLogo from "@/components/CompaniesPage/companyLogo";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { company, loading, error } = useCompany(id);
  const location = company?.company_locations[0];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Building2 className="text-muted-foreground mx-auto h-16 w-16" />
          <h2 className="text-2xl font-semibold">Company not found</h2>
          <p className="text-muted-foreground">
            The company you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const locationText = formatLocation(location);
  return (
    <div className="bg-background flex h-screen flex-col">
      <div className="container mx-auto flex-1 overflow-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-muted mb-6 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="bg-muted relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                  <CompanyLogo logo={company.logo_url} name={company.name} />

                  <Building2 className="text-muted-foreground hidden h-10 w-10" />
                </div>

                <div className="flex-1 space-y-2">
                  <h1 className="text-foreground text-3xl font-bold">
                    {company.name}
                  </h1>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">{locationText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">
                    {company.employee_count.toLocaleString()} employees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground">
                    Founded {company.founded}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">About</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {company.description}
              </p>
            </CardContent>
          </Card>

          {company.company_industries &&
            company.company_industries.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Industries</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {company.company_industries.map((item) => (
                      <Badge key={item.id} variant="secondary">
                        {item.industry.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {company.ceo && company.ceo.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Leadership</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.ceo.map((leader) => (
                  <div key={leader.id} className="flex items-start gap-4">
                    <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
                      <User className="text-muted-foreground h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground font-semibold">
                        {leader.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        CEO since {leader.since}
                      </p>
                      {leader.bio && (
                        <>
                          <Separator className="my-2" />
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {leader.bio}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {location && (location.address || location.zip_code) && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Location Details</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                {location.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                    <div className="space-y-1">
                      <p className="text-foreground text-sm">
                        {location.address}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {location.city},{" "}
                        {location.zip_code && `${location.zip_code}, `}
                        {location.country}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// hook for managing singele company data

"use client";

import type { JSX } from "react";
import { GET_COMPANY } from "../gql/queries/company";
import { useQuery } from "@apollo/client/react";

interface CompanyLocation {
  raw_location?: string;
  zip_code?: string;
  country: string;
  city: string;
  address?: string;
}

interface CEO {
  length: number;
  map(arg0: (leader: any) => JSX.Element): import("react").ReactNode;
  bio?: string;
  company_id: string;
  id: string;
  name: string;
  since: number;
}

interface CompanyIndustry {
  company_id: string;
  industry_id: string;
  id: string;
  industry: {
    name: string;
  };
}

interface CompanyData {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  employee_count: number;
  founded: number;
  company_locations: CompanyLocation[];
  ceo: CEO | null;
  company_industries: CompanyIndustry[];
  company_industry_sectors: Array<{
    sector_id: string;
    company_id: string;
  }>;
}

interface GetCompanyResponse {
  companies: CompanyData[];
}

export function useCompany(id: string) {
  const { data, loading, error } = useQuery<GetCompanyResponse>(GET_COMPANY, {
    variables: { _eq: id },
    skip: !id,
  });

  return {
    company: data?.companies[0] || null,
    loading,
    error,
  };
}

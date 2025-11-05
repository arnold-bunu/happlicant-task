"use client"

import { useState, useEffect, useMemo } from "react"
import type { Company, CompanyFilters } from "@/types/company"
import dummyData from "dummyData.json"
import { GET_COMPANIES } from "@/gql/queries/companies"
import { useQuery } from "@apollo/client/react";

interface GetCompaniesResponse {
  companies: {
    id: string;
    name: string;
    description?: string;
    logo_url?: string;
    website?: string;
    employee_count?: number;
    founded?: number;
    company_locations?: {
      address?: string;
      city?: string;
      zip_code?: string;
      country?: string;
      raw_location?: string;
    }[];
    company_industries?: {
      industry_id?: string;
    }[];
    ceo?: {
      name?: string;
      since?: number;
      bio?: string;
    }[];
  }[];
}

export function useCompanies() {

    const { loading, error, data } = useQuery<GetCompaniesResponse>(GET_COMPANIES);

//  console.log("GraphQL Data:", data);

  const [companies, setCompanies] = useState<Company[]>([])
  const [filters, setFilters] = useState<CompanyFilters>({
    search: "",
    location: "",
    industry: "",
  })
  const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true)
      try {
        if (data && data.companies ) {
          const fetchedCompanies: Company[] = data.companies.map((company: any) => ({
            id: company.id,
            name: company.name,
            website: company.website,
            logo_url: company.logo_url,
            founded: company.founded,
            employee_count: company.employee_count,
            description: company.description,
            location:
              company.company_locations && company.company_locations.length > 0
                ? {
                    address: company.company_locations[0].address,
                    city: company.company_locations[0].city,
                    zip_code: company.company_locations[0].zip_code,
                    country: company.company_locations[0].country,
                    raw_location: company?.company_locations[0]?.raw_location
                  }
                : "N/A" ,
            industry:
              company.company_industries && company.company_industries.length > 0
                ? {
                    primary: company.company_industries[0].industry.name,
                  }
                : "N/A",
            ceo:
              company.ceo && company.ceo.length > 0
                ? {
                    name: company.ceo[0].name,
                    since: company.ceo[0].since,
                    bio: company.ceo[0].bio,
                  }
                : "N/A",
            created_at: new Date().toISOString(),
          }))
          setCompanies(fetchedCompanies)
        } else {
          // Fallback to dummy data if no GraphQL data
          // setCompanies(dummyData as Company[])
        }
      } catch (error) {
        console.error("Error fetching companies:", error)
        // Fallback to dummy data on error
        // setCompanies(dummyData as Company[])
      }
      setIsLoading(false)
    }

    fetchCompanies()
  }, [data])

  // Extract unique locations and industries
  const { locations, industries } = useMemo(() => {
    const locationSet = new Set<string>()
    const industrySet = new Set<string>()

    companies.forEach((company) => {
      if (typeof company.location === "string") {
        locationSet.add(`${company?.location?.city}, ${company?.location?.country}`)
      } else {
        locationSet.add(company?.location?.raw_location!)
      }

      if (typeof company.industry === "string") {
        industrySet.add(company.industry)
      } else {
        industrySet.add(company?.industry?.primary!)
      }
    })

    return {
      locations: Array.from(locationSet).sort(),
      industries: Array.from(industrySet).sort(),
    }
  }, [companies])

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = company.name.toLowerCase().includes(searchLower)
        const matchesDescription = company?.description?.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesDescription) return false
      }

      // Location filter
      if (filters.location) {
        const companyLocation =
          typeof company.location === "string"
            ? company.location
            : `${company?.location?.city}, ${company?.location?.country}`
        if (companyLocation !== filters.location) return false
      }

      // Industry filter
      if (filters.industry) {
        const companyIndustry = typeof company.industry === "string" ? company.industry : company?.industry?.primary
        if (companyIndustry !== filters.industry) return false
      }

      return true
    })
  }, [companies, filters])

  // Mock CRUD operations
  const addCompany = async (company: Omit<Company, "id" | "created_at">) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newCompany: Company = {
      ...company,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    setCompanies((prev) => [newCompany, ...prev])
    return newCompany
  }

  const deleteCompany = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setCompanies((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      industry: "",
    })
  }

  return {
    companies: filteredCompanies,
    allCompanies: companies,
    filters,
    setFilters,
    clearFilters,
    locations,
    industries,
    isLoading,
    addCompany,
    deleteCompany,
    updateCompany,
  }
}

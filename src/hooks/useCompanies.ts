"use client";
import { useState, useEffect, useMemo } from "react";
import type { Company, CompanyFilters } from "@/types/company";
import { GET_COMPANIES } from "@/gql/queries/companies";
import {
  INSERT_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from "@/gql/mutations/companies";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";

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
  const { loading, error, data, refetch } =
    useQuery<GetCompaniesResponse>(GET_COMPANIES);

  const [insertCompanyMutation] = useMutation<{
    insert_companies_one: Company;
  }>(INSERT_COMPANY);
  const [updateCompanyMutation] = useMutation(UPDATE_COMPANY);
  const [deleteCompanyMutation] = useMutation(DELETE_COMPANY);

  //  console.log("GraphQL Data:", data);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<CompanyFilters>({
    search: "",
    location: "",
    industry: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        if (data && data.companies) {
          const fetchedCompanies: Company[] = data.companies.map(
            (company: any) => ({
              id: company.id,
              name: company.name,
              website: company.website,
              logo_url: company.logo_url,
              founded: company.founded,
              employee_count: company.employee_count,
              description: company.description,
              location:
                company.company_locations &&
                company.company_locations.length > 0
                  ? {
                      address: company.company_locations[0].address,
                      city: company.company_locations[0].city,
                      zip_code: company.company_locations[0].zip_code,
                      country: company.company_locations[0].country,
                      raw_location: company?.company_locations[0]?.raw_location,
                    }
                  : "N/A",
              industry:
                company.company_industries &&
                company.company_industries.length > 0
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
            }),
          );
          setCompanies(fetchedCompanies);
        } else {
          toast.error("No data received from server.");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to fetch companies. Please try again.");
      }
      setIsLoading(false);
    };

    fetchCompanies();
  }, [data]);

  // Extract unique locations and industries
  const { locations, industries } = useMemo(() => {
    const locationSet = new Set<string>();
    const industrySet = new Set<string>();

    companies.forEach((company) => {
      if (typeof company.location === "string") {
        locationSet.add(company.location);
      } else if (company.location) {
        const raw = company.location.raw_location;
        if (raw) {
          locationSet.add(raw);
        } else {
          const city = company.location.city ?? "";
          const country = company.location.country ?? "";
          const composed = [city, country].filter(Boolean).join(", ");
          if (composed) locationSet.add(composed);
        }
      }

      if (typeof company.industry === "string") {
        industrySet.add(company.industry);
      } else if (company.industry && company.industry.primary) {
        industrySet.add(company.industry.primary);
      }
    });

    return {
      locations: Array.from(locationSet).sort(),
      industries: Array.from(industrySet).sort(),
    };
  }, [companies]);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = company.name.toLowerCase().includes(searchLower);
        const matchesDescription = company?.description
          ?.toLowerCase()
          .includes(searchLower);
        if (!matchesName && !matchesDescription) return false;
      }

      // Location filter
      if (filters.location) {
        const companyLocation =
          typeof company.location === "string"
            ? company.location
            : `${company?.location?.city}, ${company?.location?.country}`;
        if (companyLocation !== filters.location) return false;
      }

      // Industry filter
      if (filters.industry) {
        const companyIndustry =
          typeof company.industry === "string"
            ? company.industry
            : company?.industry?.primary;
        if (companyIndustry !== filters.industry) return false;
      }

      return true;
    });
  }, [companies, filters]);

  // add company
  const addCompany = async (company: Omit<Company, "id" | "created_at">) => {
    try {
      const variables: any = {
        name: company.name,
        description: company.description,
        website: company.website,
        logo_url: company.logo_url,
        employee_count: company.employee_count,
        founded: company.founded,
      };

      // adding locatin
      if (typeof company.location !== "string" && company.location) {
        variables.address = company.location.address;
        variables.city = company.location.city;
        variables.zip_code = company.location.zip_code;
        variables.country = company.location.country;
        variables.raw_location = company.location.raw_location;
      }

      // adding industry
      if (typeof company.industry !== "string" && company.industry?.sectors) {
        variables.industry_ids = company.industry.sectors.map((id) => ({
          industry_id: id,
        }));
      }

      // Add sector data if available
      if (typeof company.industry !== "string" && company.industry?.sectors) {
        variables.sector_ids = company.industry.sectors.map((id) => ({
          industry_sector_id: id,
        }));
      }

      // Add CEO data if available
      if (typeof company.ceo !== "string" && company.ceo) {
        variables.ceo_name = company.ceo.name;
        variables.ceo_since = company.ceo.since;
        variables.ceo_bio = company.ceo.bio;
      }

      const { data } = await insertCompanyMutation({
        variables,
      });

      await refetch(); // refetch companies after adding
      const newCompany = data?.insert_companies_one;
      return newCompany!;
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company. Please try again.");
    }
  };

  // delete company
  const deleteCompany = async (id: string) => {
    try {
      await deleteCompanyMutation({
        variables: { _eq: id },
      });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      toast.success("Company deleted successfully.");
      refetch(); // refetch companies after deletion
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company. Please try again.");
    }
  };

  // update company
  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const variables: any = { id };
      if (updates.name) variables.name = updates.name;
      if (updates.description) variables.description = updates.description;
      if (updates.website) variables.website = updates.website;
      if (updates.logo_url) variables.logo_url = updates.logo_url;
      if (updates.employee_count)
        variables.employee_count = updates.employee_count;
      if (updates.founded) variables.founded = updates.founded;
      await updateCompanyMutation({
        variables,
      });
      toast.success("Company updated successfully.");
      refetch(); // refetch companies after updating
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company. Please try again.");
    }
  };

  // clear filters
  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      industry: "",
    });
  };

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
    formatLocation,
    formatIndustry,
    formatDate,
  };
}

/**
 * Custom React hook for managing companies data and related operations.
 *
 * This hook provides functionality to fetch, filter, add, update, and delete companies,
 * as well as manage associated locations, industries, and sectors. It also exposes
 *
 * @returns An object containing:
 * - `companies`: The filtered list of companies based on current filters.
 * - `allCompanies`: The complete list of companies fetched from the server.
 * - `filters`: The current filter values for searching, location, and industry.
 * - `setFilters`: Function to update the filter values.
 * - `clearFilters`: Function to reset all filters to their default values.
 * - `locations`: Array of unique company locations for filtering.
 * - `industries`: Array of unique company industries for filtering.
 * - `isLoading`: Boolean indicating if companies data is currently loading.
 * - `addCompany`: Async function to add a new company and its related data.
 * - `deleteCompany`: Async function to delete a company by its ID.
 * - `updateCompany`: Async function to update an existing company's data.

 *
 * @example
 * const {
 *   companies,
 *   filters,
 *   setFilters,
 *   addCompany,
 *   deleteCompany,
 *   updateCompany,
 *   isLoading,
 * } = useCompanies();
 */
"use client";
import { useState, useEffect, useMemo } from "react";
import type { Company, CompanyFilters } from "@/types/company";
import { GET_COMPANIES } from "@/gql/queries/companies";
import {
  INSERT_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  INSERT_COMPANY_INDUSTRY,
  INSERT_COMPANY_INDUSTRY_SECTOR,
  INSERT_INDUSRTY,
  INSERT_SECTOR,
  INSERT_COMPANY_LOCATION,
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
  const [insertCompanyIndustryMutation] = useMutation<
    { insert_companies_industries_one: { id: string } },
    { company_id: string; industry_id: string }
  >(INSERT_COMPANY_INDUSTRY);
  const [insertCompanyIndustrySectorMutation] = useMutation<
    { insert_companies_industry_sectors_one: { id: string } },
    { company_id: string; sector_id: string }
  >(INSERT_COMPANY_INDUSTRY_SECTOR);
  const [insertIndustryMutation] = useMutation<
    { insert_industries_one: { id: string } },
    { name: string }
  >(INSERT_INDUSRTY);
  const [insertSectorMutation] = useMutation<
    { insert_industry_sectors_one?: { id: string } },
    { name: string }
  >(INSERT_SECTOR);
  const [insertCompanyLocationMutation] = useMutation<
    { insert_company_locations_one: { id: string } },
    {
      company_id: string;
      address?: string;
      city?: string;
      zip_code?: string;
      country?: string;
      raw_location?: string;
    }
  >(INSERT_COMPANY_LOCATION);
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
            (company: any) => {
              const loc =
                company.company_locations &&
                company.company_locations.length > 0
                  ? company.company_locations[0]
                  : undefined;

              const location = loc
                ? {
                    address: loc.address,
                    city: loc.city,
                    zip_code: loc.zip_code,
                    country: loc.country,
                    raw_location: loc?.raw_location,
                  }
                : undefined;

              const industry =
                company.company_industries &&
                company.company_industries.length > 0
                  ? {
                      industries: company.company_industries.map(
                        (ci: any) => ci.industry?.name,
                      ),
                      primary: company.company_industries[0].industry?.name,
                    }
                  : undefined;

              const ceo =
                company.ceo && company.ceo.length > 0
                  ? {
                      name: company.ceo[0].name,
                      since: company.ceo[0].since,
                      bio: company.ceo[0].bio,
                    }
                  : undefined;

              return {
                id: company.id,
                name: company.name,
                website: company.website,
                logo_url: company.logo_url,
                founded: company.founded,
                employee_count: company.employee_count,
                description: company.description,
                location,
                industry,
                ceo,
                created_at: new Date().toISOString(),
              };
            },
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

  // Extract  locations and industries
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
      const industryIds: string[] = [];
      if (company.industry?.industries?.length) {
        for (const name of company.industry.industries) {
          const { data } = await insertIndustryMutation({
            variables: { name },
          });
          industryIds.push(data!.insert_industries_one.id);
        }
      }

      const sectorIds: string[] = [];
      if (company.industry?.sectors?.length) {
        for (const name of company.industry.sectors) {
          const { data } = await insertSectorMutation({
            variables: { name },
          });
          sectorIds.push(data!.insert_industry_sectors_one!.id);
        }
      }

      // Insert company
      const { data: companyData } = await insertCompanyMutation({
        variables: {
          name: company.name,
          description: company.description,
          website: company.website,
          logo_url: company.logo_url,
          employee_count: company.employee_count,
          founded: company.founded,
        },
      });
      const companyId = companyData?.insert_companies_one.id;

      // Insert location
      if (company.location) {
        await insertCompanyLocationMutation({
          variables: {
            company_id: companyId!,
            address: company.location.address,
            city: company.location.city,
            zip_code: company.location.zip_code,
            country: company.location.country,
            raw_location: company.location.raw_location,
          },
        });
      }
      // // Link industries
      // for (const industryId of industryIds) {
      //   await insertCompanyIndustryMutation({
      //     variables: { company_id: companyId, industry_id: industryId },
      //   });
      // }

      // // Link sectors
      // for (const sectorId of sectorIds) {
      //   await insertCompanyIndustrySectorMutation({
      //     variables: { company_id: companyId, sector_id: sectorId },
      //   });
      // }
      refetch();
      toast.success("Company added successfully.");
      return companyData?.insert_companies_one;
    } catch (error) {
      console.error("Error adding company:", error);
      throw error;
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
      refetch();
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
      refetch();
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
  };
}

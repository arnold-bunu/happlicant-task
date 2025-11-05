"use client"

import { useState, useEffect, useMemo } from "react"
import type { Company, CompanyFilters } from "@/types/company"
import dummyData from "dummyData.json"

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filters, setFilters] = useState<CompanyFilters>({
    search: "",
    location: "",
    industry: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simulate API fetch
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCompanies(dummyData as Company[])
      setIsLoading(false)
    }

    fetchCompanies()
  }, [])

  // Extract unique locations and industries
  const { locations, industries } = useMemo(() => {
    const locationSet = new Set<string>()
    const industrySet = new Set<string>()

    companies.forEach((company) => {
      if (typeof company.location === "string") {
        locationSet.add(company.location)
      } else {
        locationSet.add(`${company?.location?.city}, ${company?.location?.country}`)
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

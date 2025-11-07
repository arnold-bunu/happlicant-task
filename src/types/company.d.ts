export type Location = {
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  raw_location?: string;
};

export type CEO = {
  name?: string;
  since?: number;
  bio?: string;
};

export type Industry = {
  primary?: string;
  industries?: string[];
  sectors?: string[];
};

export type Company = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  location?: Location;
  industry?: Industry;
  employee_count?: number;
  founded?: number;
  ceo?: CEO;
  created_at: string;
  active?: boolean; // for soft delete or toggling active state
};

export type ViewMode = "table" | "grid";

export interface CompanyFilters {
  search: string;
  location: string;
  industry: string;
}

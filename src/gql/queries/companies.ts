import { gql } from "@apollo/client";

const GET_COMPANIES = gql`
  query MyQuery {
    companies(where: { active: { _eq: true } }, limit: 10) {
      name
      website
      logo_url
      id
      founded
      employee_count
      description
      company_locations {
        raw_location
        zip_code
        country
        city
        address
      }
      ceo {
        bio
        company_id
        id
        name
        since
      }
      company_industries {
        company_id
        industry_id
        industry {
          name
        }
        id
      }
      company_industry_sectors {
        sector_id
        company_id
      }
    }
  }
`;

const GET_INDUSTRIES = gql`
  query GetIndustries {
    industries {
      id
      name
    }
  }
`;

const GET_INDUSTRY_SECTORS = gql`
  query GetIndustrySectors {
    industry_sectors {
      id
      name
    }
  }
`;

const GET_COMPANIES_FOR_TABLE = gql`
  query CompaniesTable {
    companies {
      id
      name
      website
      logo_url
      founded
      employee_count
      company_locations {
        city
        country
      }
    }
  }
`;

export {
  GET_COMPANIES,
  GET_INDUSTRIES,
  GET_INDUSTRY_SECTORS,
  GET_COMPANIES_FOR_TABLE,
};

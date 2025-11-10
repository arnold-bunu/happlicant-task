import { gql } from "@apollo/client";

const INSERT_COMPANY = gql`
  mutation InsertCompany(
    $name: String!
    $description: String
    $website: String
    $logo_url: String
    $employee_count: Int
    $founded: Int
  ) {
    insert_companies_one(
      object: {
        name: $name
        description: $description
        website: $website
        logo_url: $logo_url
        employee_count: $employee_count
        founded: $founded
      }
    ) {
      id
      name
    }
  }
`;

const INSERT_COMPANY_INDUSTRY = gql`
  mutation InsertCompanyIndustry($company_id: uuid!, $industry_id: uuid!) {
    insert_company_industries(
      object: { company_id: $company_id, industry_id: $industry_id }
    ) {
      id
    }
  }
`;

const INSERT_COMPANY_INDUSTRY_SECTOR = gql`
  mutation InsertCompanyIndustrySector(
    $company_id: uuid!
    $industry_sector_id: uuid!
  ) {
    insert_company_industry_sectors_one(
      object: {
        company_id: $company_id
        industry_sector_id: $industry_sector_id
      }
    ) {
      id
    }
  }
`;

const UPDATE_COMPANY = gql`
  mutation MyMutation(
    $id: uuid!
    $description: String = ""
    $employee_count: Int = 10
    $founded: Int = 10
    $logo_url: String = ""
    $name: String = ""
    $website: String = ""
  ) {
    update_companies(
      where: { id: { _eq: $id } }
      _set: {
        description: $description
        employee_count: $employee_count
        founded: $founded
        logo_url: $logo_url
        name: $name
        website: $website
      }
    ) {
      affected_rows
    }
  }
`;

const DELETE_COMPANY = gql`
  mutation MyMutation($_eq: uuid = "") {
    update_companies(where: { id: { _eq: $_eq } }, _set: { active: false }) {
      affected_rows
    }
  }
`;

const INSERT_INDUSRTY = gql`
  mutation MyMutation($name: String = "") {
    insert_industries_one(object: { name: $name }) {
      id
    }
  }
`;

const INSERT_SECTOR = gql`
  mutation MyMutation($name: String = "") {
    insert_industry_sectors_one(object: { name: $name }) {
      id
    }
  }
`;

const INSERT_CEO = gql`
  mutation InsertCeo(
    $company_id: uuid!
    $name: String!
    $since: Int
    $bio: String
  ) {
    insert_ceos_one(
      object: { company_id: $company_id, name: $name, since: $since, bio: $bio }
    ) {
      id
    }
  }
`;

const INSERT_COMPANY_LOCATION = gql`
  mutation InsertCompanyLocation(
    $company_id: uuid!
    $address: String
    $city: String
    $zip_code: String
    $country: String
    $raw_location: String
  ) {
    insert_company_locations_one(
      object: {
        company_id: $company_id
        address: $address
        city: $city
        zip_code: $zip_code
        country: $country
        raw_location: $raw_location
      }
    ) {
      id
    }
  }
`;

export {
  INSERT_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  INSERT_COMPANY_INDUSTRY,
  INSERT_COMPANY_INDUSTRY_SECTOR,
  INSERT_INDUSRTY,
  INSERT_SECTOR,
  INSERT_CEO,
  INSERT_COMPANY_LOCATION,
};

import { gql } from "@apollo/client";

export const INSERT_COMPANY = gql`
  mutation InsertCompany(
    $name: String!
    $description: String
    $website: String
    $logo_url: String
    $employee_count: Int
    $founded: Int
    $address: String
    $city: String
    $zip_code: String
    $country: String
    $raw_location: String
    $ceo_name: String
    $ceo_since: Int
    $ceo_bio: String
  ) {
    insert_companies_one(
      object: {
        name: $name
        description: $description
        website: $website
        logo_url: $logo_url
        employee_count: $employee_count
        founded: $founded
        company_locations: {
          data: {
            address: $address
            city: $city
            zip_code: $zip_code
            country: $country
            raw_location: $raw_location
          }
        }
        ceo: { data: { name: $ceo_name, since: $ceo_since, bio: $ceo_bio } }
      }
    ) {
      id
      name
      description
      website
      logo_url
      employee_count
      founded
      company_locations {
        address
        city
        zip_code
        country
        raw_location
      }
      ceo {
        name
        since
        bio
      }
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation MyMutation(
    $_eq: uuid = ""
    $description: String = ""
    $employee_count: Int = 10
    $founded: Int = 10
    $logo_url: String = ""
    $name: String = ""
    $website: String = ""
  ) {
    update_companies(
      where: { id: { _eq: $_eq } }
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

export const DELETE_COMPANY = gql`
  mutation MyMutation($_eq: uuid = "") {
    update_companies(where: { id: { _eq: $_eq } }, _set: { active: false }) {
      affected_rows
    }
  }
`;

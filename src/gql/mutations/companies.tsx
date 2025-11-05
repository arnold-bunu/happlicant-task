import { gql } from "@apollo/client"

export const INSERT_COMPANY = gql`
mutation InsertCompany($name: String!, $description: String, $website: String, $logo_url: String, $employee_count: Int, $founded: Int, $address: String, $city: String, $zip_code: String, $country: String, $raw_location: String, $ceo_name: String, $ceo_since: Int, $ceo_bio: String) {
  insert_companies_one(object: {name: $name, description: $description, website: $website, logo_url: $logo_url, employee_count: $employee_count, founded: $founded, company_locations: {data: {address: $address, city: $city, zip_code: $zip_code, country: $country, raw_location: $raw_location}}, ceo: {data: {name: $ceo_name, since: $ceo_since, bio: $ceo_bio}}}) {
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
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany(
    $id: uuid!
    $name: String
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
    update_companies_by_pk(
      pk_columns: { id: $id }
      _set: {
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
      description
      website
      logo_url
      employee_count
      founded
    }
    
    delete_company_locations(where: { company_id: { _eq: $id } }) {
      affected_rows
    }
    
    insert_company_locations_one(
      object: {
        company_id: $id
        address: $address
        city: $city
        zip_code: $zip_code
        country: $country
        raw_location: $raw_location
      }
    ) {
      id
    }
    
    update_ceos(
      where: { company_id: { _eq: $id } }
      _set: {
        name: $ceo_name
        since: $ceo_since
        bio: $ceo_bio
      }
    ) {
      affected_rows
    }
  }
`

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: uuid!) {
    delete_companies_by_pk(id: $id) {
      id
      name
    }
  }
`

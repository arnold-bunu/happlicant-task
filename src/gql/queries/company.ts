import { gql } from "@apollo/client";

const GET_COMPANY = gql`
  query MyQuery($_eq: uuid = "") {
    companies(where: { id: { _eq: $_eq } }) {
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

export { GET_COMPANY };

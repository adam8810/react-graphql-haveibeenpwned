
import { ApolloError, gql, useQuery } from '@apollo/client';
import Pwn from '../types/PwnType';

const GET_BREACHES_BY_EMAIL = gql`
  query getBreachesByEmail($email: String!) {
    breaches(email: $email) {
      title,
      name,
      domain,
      logoPath,
      breachDate,
      description,
      dataClasses,
    }
  }
`;

function useAPI(email: string | undefined): [boolean, ApolloError | undefined, Array<Pwn>] {
  const { loading, error, data } = useQuery(GET_BREACHES_BY_EMAIL, {
    variables: {
      email
    },
    skip: !email
  });

  return [loading, error, data?.breaches || []];
}

export default useAPI;
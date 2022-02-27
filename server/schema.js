const { gql } = require('apollo-server');

const typeDefs = gql`
  type Breach {
    title: String
    name: String
    domain: String
    logoPath: String
    breachDate: String
    description: String
    dataClasses: [String]
  }

  type Query {
    breaches(email: String!): [Breach]!
  }
`;

module.exports = typeDefs;
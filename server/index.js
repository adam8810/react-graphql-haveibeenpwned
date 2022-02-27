const { ApolloServer } = require('apollo-server');
const HaveIBeenPwnedAPI = require('./haveibeenpwnedapi');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const server = new ApolloServer({
  typeDefs,
  dataSources: () => ({
    breachAPI: new HaveIBeenPwnedAPI(),
  }),
  resolvers,
});

server.listen().then(() => {
  console.log(`
    https://studio.apollographql.com/sandbox
  `);
});

module.exports = server;
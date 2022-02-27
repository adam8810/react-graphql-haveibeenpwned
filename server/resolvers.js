
module.exports = {
  Query: {
    breaches: (_, { email }, { dataSources }) =>
      dataSources.breachAPI.getBreachesByEmail(email)
  }
}
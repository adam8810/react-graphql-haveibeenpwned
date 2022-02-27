const { RESTDataSource } = require('apollo-datasource-rest');
const { key } = require('./secrets');

class HaveIBeenPwnedAPI extends RESTDataSource {
  constructor () {
    super();
    this.baseURL = 'https://haveibeenpwned.com/api/v3/';
  }

  willSendRequest(request) {
    request.headers = {
      'hibp-api-key': key
    };
  }

  async getBreachesByEmail(email) {
    const response = await this.get(`breachedaccount/${email}`, {
      truncateResponse: false,
    });
    
    return !Array.isArray(response) ? [] :
    response.map(this.breachReducer);
  }

  breachReducer(breach) {
    return {
      title: breach.Title,
      name: breach.Name,
      domain: breach.Domain || null,
      logoPath: breach.LogoPath,
      description: breach.Description.replace(/(<([^>]+)>)/g, ''),
      breachDate: breach.BreachDate,
      logoPath: breach.LogoPath,
      dataClasses: breach.DataClasses,
    }
  }
}

module.exports = HaveIBeenPwnedAPI;
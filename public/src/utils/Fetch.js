export class Fetch {
  static baseUrl = "http://localhost:3000"; // todo make this dynamic

  static async get(endpoint) {
    try {
      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      };
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
      if (response.ok) {
        return response.json();
      } else throw "error making GET request";
    } catch (error) {
      return error;
    }
  }

  static async post(endpoint, data) {
    try {
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);

      if (response.ok) {
        return response;
      } else {
        throw "error making POST request";
      }
    } catch (error) {
      return error;
    }
  }
}

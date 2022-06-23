import { setBaseUrl } from "./setBaseUrl.js";

export class Fetch {
  static baseUrl = setBaseUrl();

  static async get(endpoint: string) {
    try {
      const options: RequestInit = {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      };
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
      if (response.ok) {
        return response.json();
      } else throw `error making GET request to /${endpoint}`;
    } catch (error) {
      return error;
    }
  }

  static async post(endpoint: string, data: Record<string, string | number>) {
    try {
      const options: RequestInit = {
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
        throw `error making POST request to /${endpoint}`;
      }
    } catch (error) {
      return error;
    }
  }
}

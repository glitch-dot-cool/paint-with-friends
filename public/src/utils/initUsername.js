import { Fetch } from "./Fetch.js";
import { LocalStorage } from "./LocalStorage.js";

export const initUsername = (socketID) => {
  const username = LocalStorage.get("pwf_username");
  if (username) {
    Fetch.post("update-username", { id: socketID, username });
  }
};

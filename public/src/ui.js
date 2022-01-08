import { Fetch } from "./utils/Fetch.js";
import { LocalStorage } from "./utils/LocalStorage.js";

const nameInput = document.querySelector("#name-input");
const updateUsernameBtn = document.querySelector("#update-username");

updateUsernameBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const username = nameInput.value;
  const socketID = LocalStorage.get("pwf_socket");
  LocalStorage.set("pwf_username", username);
  Fetch.post("update-username", { id: socketID, username });
});

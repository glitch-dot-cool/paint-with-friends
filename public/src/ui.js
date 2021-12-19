import { Fetch } from "./utils/Fetch.js";
import { LocalStorage } from "./utils/LocalStorage.js";

const nameInput = document.querySelector("#name-input");
const updateUsernameBtn = document.querySelector("#update-username");

updateUsernameBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const socketID = LocalStorage.get("pwf_socket");
  Fetch.post("update-username", { id: socketID, username: nameInput.value });
});

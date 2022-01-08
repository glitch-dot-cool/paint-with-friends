import { Fetch } from "./utils/Fetch.js";
import { LocalStorage } from "./utils/LocalStorage.js";

// username input

const nameInput = document.querySelector("#name-input");
const updateUsernameBtn = document.querySelector("#update-username");

updateUsernameBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const username = nameInput.value;
  const socketID = LocalStorage.get("pwf_socket");
  LocalStorage.set("pwf_username", username);
  Fetch.post("update-username", { id: socketID, username });
});

// chat input
const chatInput = document.querySelector("#message-input");
const sendMessageBtn = document.querySelector("#send-message");

sendMessageBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const message = chatInput.value;
  chatInput.value = "";
  const socketID = LocalStorage.get("pwf_socket");
  Fetch.post("message", { id: socketID, message });
});

import { Fetch } from "./utils/Fetch.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.min.js";

// username input
const nameInput = document.querySelector("#name-input");
const updateUsernameBtn = document.querySelector("#update-username");
const changeUsernameContainer = document.querySelector("#username-form");
const changeNameBtn = document.querySelector("#change-username");

updateUsernameBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const username = nameInput.value;
  const socketID = LocalStorage.get("pwf_socket");
  LocalStorage.set("pwf_username", username);
  nameInput.value = "";
  changeUsernameContainer.classList.toggle("hide");
  Fetch.post("update-username", { id: socketID, username });
});

changeNameBtn.addEventListener("click", () => {
  changeUsernameContainer.classList.toggle("hide");
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

const picker = new EmojiButton({
  rootElement: document.querySelector("#chat-form"),
  theme: "dark",
  autoFocusSearch: false,
});
const trigger = document.querySelector("#emoji-picker");

picker.on("emoji", ({ emoji }) => {
  chatInput.value = `${chatInput.value} ${emoji}`;
});

trigger.addEventListener("click", (e) => {
  e.preventDefault();
  picker.togglePicker(trigger);
});

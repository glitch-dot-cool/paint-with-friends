import { Fetch } from "./utils/Fetch.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.min.js";
import { camera } from "./utils/Camera.js";

// username input
const nameInput = document.querySelector("#name-input");
const updateUsernameBtn = document.querySelector("#update-username");
const changeUsernameContainer = document.querySelector("#username-form");
const changeNameBtn = document.querySelector("#change-username");

nameInput.addEventListener("input", (e) => {
  if (e.target.value.length > 32) {
    nameInput.classList.add("error");
    updateUsernameBtn.setAttribute("disabled", "");
  } else {
    nameInput.classList.remove("error");
    updateUsernameBtn.removeAttribute("disabled");
  }
});

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
  nameInput.focus();
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
  camera.activate();
});

trigger.addEventListener("click", (e) => {
  e.preventDefault();
  picker.togglePicker(trigger);

  // disable camera while menu is open to prevent accidental zoom
  if (picker.pickerVisible) camera.deactivate();
});

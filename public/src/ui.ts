// @ts-ignore-nextline
import { EmojiButton } from "https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.min.js";
import { Fetch } from "./utils/Fetch.js";
import { LocalStorage } from "./utils/LocalStorage.js";
import { camera } from "./utils/Camera.js";
import { animateableLfoParams } from "./constants.js";
import { LfoDomElements } from "../../types.js";

export const lfoDomElements = {} as LfoDomElements;

export const getLfoDomElements = (lfoDomElements: LfoDomElements) => {
  animateableLfoParams.forEach((param) => {
    const input = document.querySelector<HTMLInputElement>(`#${param} input`)!;
    const label = document.querySelector<HTMLLabelElement>(`#${param} label`)!;

    lfoDomElements[param] = { input, label };
  });

  return lfoDomElements;
};

// username input
const nameInput = document.querySelector<HTMLInputElement>("#name-input")!;
const updateUsernameBtn =
  document.querySelector<HTMLButtonElement>("#update-username")!;
const changeUsernameContainer =
  document.querySelector<HTMLFormElement>("#username-form")!;
const changeNameBtn =
  document.querySelector<HTMLButtonElement>("#change-username")!;

nameInput.addEventListener("input", (e) => {
  const textContent = (e.target as HTMLInputElement).value;

  if (textContent.length > 32) {
    nameInput.classList.add("error");
    updateUsernameBtn.setAttribute("disabled", "");
  } else {
    nameInput.classList.remove("error");
    updateUsernameBtn.removeAttribute("disabled");
  }
});

updateUsernameBtn?.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const username = nameInput?.value;
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
const chatInput = document.querySelector<HTMLInputElement>("#message-input")!;
const sendMessageBtn =
  document.querySelector<HTMLButtonElement>("#send-message")!;

chatInput.addEventListener("input", (e) => {
  const textContent = (e.target as HTMLInputElement).value;

  if (textContent.length > 500) {
    chatInput.classList.add("error");
    sendMessageBtn.setAttribute("disabled", "");
  } else {
    chatInput.classList.remove("error");
    sendMessageBtn.removeAttribute("disabled");
  }
});

sendMessageBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent page refresh on submit
  const message = chatInput.value;
  chatInput.value = "";
  const socketID = LocalStorage.get("pwf_socket");
  Fetch.post("message", { id: socketID, message });
});

const messageContainer =
  document.querySelector<HTMLDivElement>("#message-container")!;
messageContainer.addEventListener("mousedown", (e) => {
  const chatList = document.querySelector("#chat-list")!;
  // disabled drawing if chat is visible
  const opacity = window.getComputedStyle(chatList).getPropertyValue("opacity");
  if (Number(opacity) > 0) e.stopPropagation();
});

const picker = new EmojiButton({
  rootElement: document.querySelector("#chat-form"),
  theme: "dark",
  autoFocusSearch: false,
  autoHide: false,
});
const trigger = document.querySelector("#emoji-picker");

picker.on("emoji", ({ emoji }: { emoji: string }) => {
  chatInput.value = `${chatInput.value} ${emoji}`;
});

picker.on("hidden", () => {
  camera.activate();
});

trigger?.addEventListener("click", (e) => {
  e.preventDefault();
  picker.togglePicker(trigger);

  // disable camera while menu is open to prevent accidental zoom
  if (picker.pickerVisible) camera.deactivate();
});

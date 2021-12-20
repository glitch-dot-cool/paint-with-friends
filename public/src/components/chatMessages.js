// const messageContainer = document.querySelector("#message-container");
const messages = [];

export const chatMessages = (message) => {
  console.log(messages, messages.length);

  // max 10 messages at a time
  if (messages.length > 9) {
    messages.splice(0, 1);
  }

  messages.push(message);

  const ul = document.createElement("ul");
  ul.setAttribute("id", "chat-list");

  messages.forEach((message) => {
    createMessageMarkup(message, ul);
  });

  const currentList = document.querySelector("#chat-list");
  currentList.replaceWith(ul);
};

const createMessageMarkup = (message, list) => {
  const li = document.createElement("li");
  li.classList.add("chat-list-item");

  const span = document.createElement("span");
  span.classList.add("chat-message-author");
  span.textContent = message.sender;

  const p = document.createElement("p");
  p.classList.add("chat-message");
  p.textContent = message.message;

  list.appendChild(li);
  li.appendChild(span);
  li.appendChild(p);
};

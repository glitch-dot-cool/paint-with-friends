export const chatMessages = (messages) => {
  if (!messages.length) return;

  // create new unordered list to replace old one
  const ul = document.createElement("ul");
  ul.classList.add("backdrop", "fade-out");
  ul.setAttribute("id", "chat-list");

  // append list elements for each message
  messages.forEach((message) => {
    createMessageMarkup(message, ul);
  });

  // replace the old list w/ the new one
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

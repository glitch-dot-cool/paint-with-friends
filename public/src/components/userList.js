import { LocalStorage } from "../utils/LocalStorage.js";

export const userList = (users) => {
  // grab the existing list & template
  const ul = document.getElementById("username-list");
  const template = document.getElementById("connected-users-template");

  // create empty copy of list (recreating the initial structure)
  const newList = document.createElement("ul");
  newList.setAttribute("id", "username-list");
  newList.appendChild(template);

  // create updated list
  Object.values(users).forEach((username) => {
    const listItem = document.importNode(template.content, true);
    const storedUsername = LocalStorage.get("pwf_username");
    const socketID = LocalStorage.get("pwf_socket");
    let text = "";

    if (username === storedUsername || username === socketID) {
      text = `${username} <span class="dim">(you)</span>`;
    } else {
      text = username;
    }

    listItem.querySelector(".username").innerHTML = text;
    newList.appendChild(listItem);
  });

  // update list by replacing w/ newly created one
  ul.replaceWith(newList);
};

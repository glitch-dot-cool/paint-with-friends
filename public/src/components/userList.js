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
    listItem.querySelector(".username").textContent = username;
    newList.appendChild(listItem);
  });

  // update list by replacing w/ newly created one
  ul.replaceWith(newList);
};

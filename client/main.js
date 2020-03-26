const chatForm = document.getElementById("chat-form");
const mainChatArea = document.getElementById("main-chat");

// Get username and room from URL
const { name, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
console.log(name, room);

const socket = io();

// Join chatroom
socket.emit("joinRoom", { name, room });

// Message from server
socket.on("message", message => {
  console.log(message);
  addNewMessage(message.username, message.text);
  mainChatArea.scrollTop = mainChatArea.scrollHeight;
});

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const msg = document.getElementById("msg").value;
  socket.emit("userMessage", msg);
  document.getElementById("msg").value = "";
  document.getElementById("msg").focus();
});

const addNewMessage = (username, message) => {
  const element = document.createElement("div");
  element.innerHTML = `<strong>${username}</strong>: <p>${message}</p>`;
  mainChatArea.appendChild(element);
};

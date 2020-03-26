const chatForm = document.getElementById("chat-form");
const mainChatArea = document.getElementById("main-chat");
const chatInput = document.getElementById("msg");
const typingMessageArea = document.getElementById("typing-message");
let typing = false;

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

// On typing
socket.on("addTyping", data => addTypingMessage(data));

// To emit the messages
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const msg = document.getElementById("msg").value;
  socket.emit("userMessage", msg);
  document.getElementById("msg").value = "";
  document.getElementById("msg").focus();
});

// To add the messages on the front end
const addNewMessage = (username, message) => {
  const element = document.createElement("div");
  element.innerHTML = `<strong>${username}</strong>: <p>${message}</p>`;
  mainChatArea.appendChild(element);
};

// Add typing message on screen
const addTypingMessage = message => {
  if (message) {
    typingMessageArea.innerHTML = message;
  } else {
    typingMessageArea.innerHTML = "";
  }
};

const timeoutFunction = () => {
  typing = false;
  socket.emit("typing", false);
};

// To send typing
chatInput.addEventListener("keypress", e => {
  typing = true;
  socket.emit("typing", true);
  timeout = setTimeout(timeoutFunction, 2000);
});

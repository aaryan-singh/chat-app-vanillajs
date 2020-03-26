const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const PORT = process.env.PORT || 8000;
const botName = "Chat Bot";

// serve static files by setting static folder
app.use(express.static(path.join(__dirname, "../client"))); // first middleware, so it's gonna serve

// Run when a client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({ name, room }) => {
    console.log({ name, room, id: socket.id });
    const user = userJoin({ id: socket.id, name, room });
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "Welcome to chat"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.name} has joined the chat`)
      );
  });

  socket.on("userMessage", msg => {
    const as = getCurrentUser(socket.id);
    io.to(as.room).emit("message", formatMessage(as.name, msg));
  });

  socket.on("typing", data => {
    const user = getCurrentUser(socket.id);
    if (data) {
      socket.broadcast
        .to(user.room)
        .emit("addTyping", `${user.name} is typing...`);
    } else {
      socket.broadcast.to(user.room).emit("addTyping", "");
    }
  });

  socket.on("disconnect", () => {
    const as = getCurrentUser(socket.id);
    if (as) {
      io.to(as.room).emit(
        "message",
        formatMessage(botName, `${as.name} has left the chat`)
      );
    }
  });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

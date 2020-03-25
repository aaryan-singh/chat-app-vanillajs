const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 8000;

// serve static files by setting static folder
app.use(express.static(path.join(__dirname, "../client"))); // first middleware, so it's gonna serve

// Run when a client connects
io.on("connection", socket => {
  console.log("New WS Connection...");

  socket.emit("message", "Welcome to chat");

  socket.broadcast.emit("message", "User has joined the chat");

  socket.on("userMessage", msg => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

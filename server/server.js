const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var { generateMessage, generateLocationMessage } = require("./utills/message");

var app = express();
app.use(express.static(publicPath));

// Create sever using node http module
var server = http.createServer(app);

//connect server to the socket IO
var io = socketIO(server);

//Listen to the socket events
io.on("connection", socket => {
  console.log("New User Connected");

  // Emit Event to all connected User
  socket.emit("newMessage", generateMessage("Admin", "Welcome to Chat App"));

  // Emit Other Connected Clients that User has Joined
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New User Joined")
  );

  // Listen to the Events
  socket.on("createMessage", (message, acknowledge) => {
    console.log("Message from Client", message);

    // To broadcast to all connected Clients
    io.emit("newMessage", generateMessage(message.from, message.text));
    acknowledge("Message Recieved from the Server");

    // To broadcast on all clients expect this (the one who is emitting event)
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});

const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));

// Create sever using node http module
var server = http.createServer(app);

//connect server to the socket IO
var io = socketIO(server);

//Listen to the socket events
io.on("connection", socket => {
  console.log("New User Connected");

  //Emit the Event to the specific connected client
  //   socket.emit("newMessage", {
  //     to: "nick",
  //     from: "hemi",
  //     text: "Hi Nick, Its Hemi."
  //   });

  socket.emit("welcome", {
    message: "Welcome to the Chat App"
  });

  socket.on("joining", member => {
    socket.broadcast.emit("joiningMessage", {
      message: `Hi guys ${member} has joined the chat room`
    });
  });

  // Listen to the Events
  socket.on("CreateMessage", message => {
    console.log("Message from Client", message);
    
    // To broadcast to all connected Clients
    // io.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });

    // To broadcast on all clients expect this (the one who is emitting event)
    socket.broadcast.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});

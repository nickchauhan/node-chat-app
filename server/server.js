const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var { generateMessage, generateLocationMessage } = require("./utils/message");
var { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

var users = new Users();

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
  // socket.emit("newMessage", generateMessage("Admin", "Welcome to Chat App"));

  // Emit Other Connected Clients that User has Joined
  // socket.broadcast.emit(
  //   "newMessage",
  //   generateMessage("Admin", "New User Joined")
  // );

  //check the Join Rooms
  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and room name are required.");
    }

    // Join to the Room
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // Update the users in the Room
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    // Send Welcome message to the User
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    // Notify Other Users the New User has Joined
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined.`)
      );

    callback();
  });

  // Listen to the Events
  socket.on("createMessage", (message, acknowledge) => {
    console.log("Message from Client", message);

    // Get User details
    var user = users.getUser(socket.id);

    // To broadcast to all connected Clients in the Room
    if (user && isRealString(message.text)) {
      // Send everyone in to room the Message
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }

    acknowledge("Message Recieved from the Server");

    // To broadcast on all clients expect this (the one who is emitting event)
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on("createLocationMessage", coords => {
    var user = users.getUser(socket.id);

    // Get User details
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.emit(
        "newLocationMessage",
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left.`)
      );
    }

    // console.log("User disconnect");
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});

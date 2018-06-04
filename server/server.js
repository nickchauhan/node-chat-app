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

  //Emit the Event
  socket.emit("newMessage", {
    to: "nick",
    from: "hemi",
    text: "Hi Nick, Its Hemi."
  });

  // Listen to the Events
  socket.on("CreateMessage", newMessage => {
    console.log("Message from Client", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});

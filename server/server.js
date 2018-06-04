const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();

// Create sever using node http module
var server = http.createServer(app);

//connect server to the socket IO

var io = socketIO(server);
//Listen to the socket events

io.on("connection", socket => {
  console.log("New User Connected");

  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

app.use(express.static(publicPath));
server.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});

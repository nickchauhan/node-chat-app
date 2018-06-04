// bind the socket connection
var socket = io();

socket.on("connect", function() {
  console.log("connected to server");

  // Emit Event
  socket.emit("CreateMessage", {
    to: "hemi",
    from: "nick",
    text: "Hii Hemi, Its Nick."
  });
});

socket.on("disconnect", function() {
  console.log("Server is disconnected");
});

// Listen to the Event
socket.on("newMessage", function(newMessage) {
  console.log("Message from Server", newMessage);
});

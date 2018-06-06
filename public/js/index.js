// bind the socket connection
var socket = io();

socket.on("connect", function() {
  console.log("connected to server");

  //   Emit Event
  //   socket.emit(
  //     "createMessage",
  //     {
  //       to: "hemi",
  //       from: "nick",
  //       text: "Hii Hemi, Its Nick."
  //     },
  //     function(acknowledge) {
  //       console.log(acknowledge);
  //     }
  //   );
});

socket.on("disconnect", function() {
  console.log("Server is disconnected");
});

// Listen to the Event
socket.on("newMessage", function(message) {
  var formatedTime = moment(message.createdAt).format("h:mm a");
  console.log("Message from Server", message);
  var li = $("<li></li>");
  li.text(`${message.from} ${formatedTime}: ${message.text}`);
  $("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var formatedTime = moment(message.createdAt).format("h:mm a");

  console.log("Message from Server", message);
  var li = $("<li></li>");
  var a = $("<a target='_blank'>My Current Location</a>");
  li.text(`${message.from} ${formatedTime}: `);
  a.attr("href", message.url);
  li.append(a);
  $("#messages").append(li);
});

// Form Submission Handler
jQuery("#message-form").on("submit", function(e) {
  e.preventDefault();
  var messageTextbox = jQuery("[name=message]");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val("");
    }
  );
});

// Location Button Handler

var locationButton = $("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }
  locationButton.attr("disabled", "disabled").text("Sending location...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr("disabled").text("Send location");

      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr("disabled").text("Send location");

      alert("Unable to fetch location.");
    }
  );
});

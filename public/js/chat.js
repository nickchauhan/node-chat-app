function scrollToBottom() {
  // Selectors
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  // Heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

// bind the socket connection
var socket = io();

socket.on("connect", function() {
  console.log("connected to server");

  var params = jQuery.deparam(window.location.search);

  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });

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

socket.on("updateUserList", function(users) {
  var ol = jQuery("<ol></ol>");

  users.forEach(function(user) {
    ol.append(jQuery("<li></li>").text(user));
  });

  jQuery("#users").html(ol);
});

// Listen to the Event
socket.on("newMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery("#messages").append(html);
  scrollToBottom();
  // var formatedTime = moment(message.createdAt).format("h:mm a");
  // console.log("Message from Server", message);
  // var li = $("<li></li>");
  // li.text(`${message.from} ${formatedTime}: ${message.text}`);
  // $("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery("#messages").append(html);
  scrollToBottom();
  // var formatedTime = moment(message.createdAt).format("h:mm a");
  // console.log("Message from Server", message);
  // var li = $("<li></li>");
  // var a = $("<a target='_blank'>My Current Location</a>");
  // li.text(`${message.from} ${formatedTime}: `);
  // a.attr("href", message.url);
  // li.append(a);
  // $("#messages").append(li);
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

var expect = require("expect");
var { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate the message object", () => {
    var from = "Nick";
    var text = "Hi , How are you ?";

    var message = generateMessage(from, text);
    expect(typeof message.createdAt).toBe("number");
    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
  });
});

describe("generateLocationMessage", () => {
  it("should return url for lat long", () => {
    var from = "Nick";
    var lat = 12;
    var long = 13;

    var message = generateLocationMessage(from, lat, long);
    expect(message.url).toBe("https://www.google.co.in/maps/?q=12,13");
    expect(typeof message.createdAt).toBe("number");
    expect(message.from).toBe(from);
  });
});

const webSocketServer = require("websocket").server;
const http = require("http");
const uuidv4 = require("uuid").v4;

// create server
const server = http.createServer();
server.listen(process.env.PORT || 5000);
console.log("Listening on port 5000");

// make websocket server
const wsServer = new webSocketServer({
  httpServer: server,
});

// Improvement later, this should be in redis or something similar for production scaling
const clients = {};

wsServer.on("request", function (req) {
  var userID = uuidv4();
  console.log("userID :>> ", userID);
  // log new connection
  console.log(
    `${new Date()} Recieved a new connection from origin ${req.origin}.`
  );

  // Todo: rewrite this to accept only requests from allowed origins
  // Create fresh connection with userid
  const connection = req.accept(null, req.origin);
  clients[userID] = connection;
  console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`);

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log(`Received Message: ${message.utf8Data}`);

      // broadcasting message to ALL connected clients
      // TODO: change this from all clients to only clients on chat list
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log(`sent message to: ${clients[key]}`);
      }
    }
  });
});

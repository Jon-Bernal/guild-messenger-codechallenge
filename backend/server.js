require("dotenv").config();
const express = require("express");
const webSocketServer = require("websocket").server;
const uuidv4 = require("uuid").v4;
const { MongoClient } = require("mongodb");
const helmet = require("helmet");
const cors = require("cors");

async function run() {
  try {
    // ===== setup express server ===== //
    const app = express();
    const port = process.env.PORT || 5000;
    app.use(express.json());
    app.use(helmet());
    // leaving this wide open, wouldn't do that for a production app
    app.use(cors());

    const database = await MongoClient.connect(`${process.env.MONGO_URL}`, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // express routes go here
    app.post("/login", (req, res) => {
      res.send("signed in!");
    });

    app.post("/signup", (req, res) => {
      res.send("Hello World!");
    });

    const expressServer = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });

    const wsServer = new webSocketServer({
      httpServer: app,
    });

    expressServer.on("upgrade", (request, socket, head) => {
      wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit("connection", socket, request);
      });
    });

    // Improvement later, this should be in redis or something similar for production scaling
    const clients = {};

    wsServer.on("request", function (req) {
      var socketID = uuidv4();
      console.log("userID :>> ", socketID);
      // log new connection
      console.log(
        `${new Date()} Recieved a new connection from origin ${req.origin}.`
      );

      // Todo: rewrite this to accept only requests from allowed origins
      // Create fresh connection with userid
      const connection = req.accept(null, req.origin);
      clients[socketID] = connection;
      console.log(
        `connected: ${socketID} in ${Object.getOwnPropertyNames(clients)}`
      );

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
  } catch (err) {
    // Stop the servers, something went really wrong!
    console.log("WARNING: node has exited with the following error!!!");
    console.log(err);
    ws.shutDown();
    process.exit(1);
  }
}
run();

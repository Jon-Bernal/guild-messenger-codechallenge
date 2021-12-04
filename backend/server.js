require("dotenv").config();
const express = require("express");
const webSocketServer = require("websocket").server;
const uuidv4 = require("uuid").v4;
const { MongoClient } = require("mongodb");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const convoRoutes = require("./routes/convo");

let wsServer;

console.log("process.env.MONGO_URL :>> ", process.env.MONGO_URL);

async function run() {
  try {
    // ===== setup express server ===== //
    const app = express();
    const port = process.env.PORT || 5000;
    app.use(express.json());
    app.use(helmet());
    // leaving this wide open, wouldn't do that for a production app
    app.use(cors());

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/convo", convoRoutes);

    const db = await MongoClient.connect(`${process.env.MONGO_URL}`, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const expressServer = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}/api`);
    });

    wsServer = new webSocketServer({
      httpServer: app,
    });

    const clients = {};

    // Improvement later, this should be in redis or something similar for production scaling
    expressServer.on("upgrade", (request, socket, head) => {
      wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit("connection", socket, request);
      });
    });

    wsServer.on("request", function (req) {
      // log new connection
      console.log(
        `${new Date()} Recieved a new connection from origin ${req.origin}.`
      );

      // Todo: rewrite this to accept only requests from allowed origins
      // Create fresh connection with userid
      const connection = req.accept(null, req.origin);

      // grab userid from frontend
      const userID = req?.httpRequest?.url.split("=")[1];
      clients[userID] = connection;
      console.log(
        `connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`
      );

      connection.on("message", async function (message) {
        if (message.type === "utf8") {
          const msgData = JSON.parse(message.utf8Data);
          const recipient = msgData?.recipient;
          const senderID = msgData?.userID;
          const sender = msgData?.username;
          const msg = msgData.msg;

          // TODO: if no convoid should have an error case here
          // check for convoID
          if (!recipient) return;

          // TODO: this should be wrapped in another try catch to keep from crashing the app when it doesn't work
          // if convoID, fetch user id's involved
          const convo = await db
            .db("messengerApp")
            .collection("convos")
            .findOne({
              $and: [{ userList: senderID }, { userList: recipient }],
            });
          if (convo) {
            const test1 = await db
              .db("messengerApp")
              .collection("convos")
              .findOneAndUpdate(
                { $and: [{ userList: senderID }, { userList: recipient }] },
                {
                  $push: {
                    messages: { username: sender, msg: msg, userID: senderID },
                  },
                },
                { upsert: true }
              );
          } else {
            const test2 = await db
              .db("messengerApp")
              .collection("convos")
              .insertOne(
                {
                  userList: [senderID, recipient],
                  messages: [{ username: sender, msg: msg, userID: senderID }],
                },
                { upsert: true }
              );
          }

          // Send message to recipient
          clients[recipient].sendUTF(message.utf8Data);
          console.log(`sent message to: ${clients[recipient]}`);
          // Send message back to original sender to confirm
          clients[senderID].sendUTF(message.utf8Data);
          console.log(`sent message to: ${clients[senderID]}`);
        }
      });
    });
  } catch (err) {
    // Stop the servers, something went really wrong!
    console.log("WARNING: node has exited with the following error!!!");
    console.log(err);
    wsServer.shutDown();
    process.exit(1);
  }
}
run();

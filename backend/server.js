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

async function run() {
  try {
    // ===== setup express server ===== //
    const app = express();
    const port = process.env.PORT || 5000;
    app.use(express.json());
    app.use(helmet());
    // leaving this wide open, wouldn't do that for a production app
    app.use(cors());

    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/convo", convoRoutes);

    const db = await MongoClient.connect(`${process.env.MONGO_URL}`, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const expressServer = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });

    const wsServer = new webSocketServer({
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
          console.log(`Received Message: ${message.utf8Data}`);
          console.log("message :>> ", JSON.parse(message.utf8Data));
          const msgData = JSON.parse(message.utf8Data);
          const recipient = msgData?.recipient;
          const senderID = msgData?.userID;
          const sender = msgData?.username;
          const msg = msgData.msg;

          console.log("recipient :>> ", recipient);
          console.log("sender :>> ", senderID);
          console.log("msg :>> ", msg);

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
          console.log("convo :>> ", convo);
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
            console.log("test1 :>> ", test1);
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
            console.log("test2 :>> ", test2);
          }
          console.log("users :>> ", users);
          // no convoID, create one and add userids

          // send only to users in convoid

          // TODO: change this from all clients to only clients on chat list
          // broadcasting message to ALL connected clients
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

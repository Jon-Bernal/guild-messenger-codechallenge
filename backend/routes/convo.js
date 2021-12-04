const { MongoClient } = require("mongodb");
const router = require("express").Router();

MongoClient.connect(
  `${process.env.MONGO_URL}`,
  {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    // This would be a server side search for a specific user if I had more time and this was really going to be a production app instead of sending everything to the client, which is a user info security no no.
    router.post("/", async (req, res) => {
      try {
        const data = await db
          .db("messengerApp")
          .collection("convos")
          .findOne({
            $and: [
              { userList: req.body.userID },
              { userList: req.body.convoPartner },
            ],
          });

        res.status(200).json({ convo: data?.messages ? data.messages : [] });
      } catch (err) {
        console.log("/users err :>> ", err);
        res.status(500).json({ error: "error fetching from database" });
      }
    });
  }
);

module.exports = router;

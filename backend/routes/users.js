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
    router.get("/", async (req, res) => {
      try {
        const projection = { username: 1, pass: 0 };

        const data = await db
          .db("messengerApp")
          .collection("users")
          .find({}, projection)
          .toArray();

        if (!data) return res.status(404).json({ error: "no users found" });

        users = data
          .filter((u) => u._id.toString() !== req.query.userID.toString())
          .map((u) => {
            return {
              userID: u._id,
              username: u.username,
            };
          });

        res.status(200).json({ users });
      } catch (err) {
        console.log("/users err :>> ", err);
        res.status(500).json({ error: "error fetching from database" });
      }
    });
  }
);

module.exports = router;

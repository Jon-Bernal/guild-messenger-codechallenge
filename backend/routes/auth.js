const { MongoClient } = require("mongodb");
const router = require("express").Router();
const bcrypt = require("bcrypt");

MongoClient.connect(
  `${process.env.MONGO_URL}`,
  {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    router.post("/login", async (req, res) => {
      try {
        if (!req.body.username) return res.status(400);
        const user = await db
          .db("messengerApp")
          .collection("users")
          .findOne({ username: req.body.username });

        if (!user) return res.status(404).json({ error: "no user found" });

        const match = await bcrypt.compare(req.body.pass, user.pass);
        if (!match) throw "Incorrect username or password";
        console.log("match :>> ", match);

        res.status(200).json({ username: user.username, userID: user._id });
      } catch (err) {
        if (err === "Incorrect username or password") {
          res.json({ error: "Incorrect username or password" });
        }
        console.log("login error :>> ", err);
        res.status(500);
      }
    });

    router.post("/signup", async (req, res) => {
      try {
        const username = req.body.username;
        const pass = req.body.pass;

        const hashedPass = await bcrypt.hash(pass, 12);

        const dupCheck = await db
          .db("messengerApp")
          .collection("users")
          .findOne({ username });

        if (dupCheck) {
          return res.json({ error: "user already exists" });
        }

        const test = await db
          .db("messengerApp")
          .collection("users")
          .insertOne({ username, pass: hashedPass });
        // .insertOne({ username: req.body.username });

        res.json({ userID: test.insertedId }).status(201);
      } catch (error) {
        console.log("singup error :>> ", error);
        res.json({ userid: test.insertedId }).status(500);
      }
    });
  }
);

module.exports = router;

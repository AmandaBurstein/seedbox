let cors = require("cors");
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
app.use("/public", express.static("public"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@clusteramanda-kqoqy.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("dev-test");
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  dbo.collection("users").findOne({ username: username }, (error, user) => {
    if (error) {
      res.send(JSON.stringify({ success: false, error }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.password !== password) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.password === password) {
      res.send(JSON.stringify({ success: true }));
    }
  });
  res.send(JSON.stringify({ success: false, error }));
});

app.post("/add-key", (req, res) => {
  let username = req.body.username;
  let key = req.body.key;
  dbo
    .collection("users")
    .updateOne({ username: username }, { $set: { key: key } })
    .then(() => res.send(JSON.stringify({ success: true })))
    .catch(error =>
      res.send(
        JSON.stringify({
          success: false,
          error
        })
      )
    );
});

app.post("/verify-key", (req, res) => {
  let key = req.body.key;
  dbo.collection("users").findOne({ key: key }, (error, user) => {
    if (error) {
      console.log("/verify-key error", error);
      res.send(JSON.stringify({ success: false, error }));
      return;
    }
    if (user.key === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.key !== key) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.key === key) {
      res.send(JSON.stringify({ success: true }));
    }
  });
  res.send(JSON.stringify({ success: false, error }));
});

app.get("/servers", (req, res) => {
  dbo
    .collection("test-servers")
    .find({})
    .toArray((error, servers) => {
      if (error) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify(servers));
    });
});

app.post("/delete-server", (req, res) => {
  let serverId = req.body.serverId;
  dbo
    .collection("test-servers")
    .deleteOne({ ServerId: serverId })
    .then(() => res.send(JSON.stringify({ success: true })))
    .catch(error =>
      res.send(
        JSON.stringify({
          success: false,
          error
        })
      )
    );
});

app.post("/add-server", (req, res) => {
  let newId = req.body.newId;
  dbo
    .collection("test-servers")
    .insertOne({
      ServerId: newId
    })
    .then(() => res.send(JSON.stringify({ success: true })))
    .catch(error =>
      res.send(
        JSON.stringify({
          success: false,
          error
        })
      )
    );
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});

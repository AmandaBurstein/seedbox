let cors = require("cors");
let express = require("express");
let app = express();
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
app.use("/", express.static("build"));
// // app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@clusteramanda-kqoqy.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("dev-test");
});

app.post("/login", upload.none(), (req, res) => {
  console.log("login endpoint hit");
  console.log("req.body:", req.body);
  let username = req.body.username;
  let password = req.body.password;
  dbo.collection("users").findOne({ username: username }, (error, user) => {
    if (error) {
      console.log("/login error", error);
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
});

app.post("/add-key", upload.none(), (req, res) => {
  console.log("add-key endpoint hit");
  console.log("req.body:", req.body);
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

app.post("/verify-key", upload.none(), (req, res) => {
  console.log("verify-key endpoint hit");
  console.log("req.body:", req.body);
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
});

app.get("/servers", upload.none(), (req, res) => {
  console.log("/servers endpoint hit");
  dbo
    .collection("test-servers")
    .find({})
    .toArray((error, servers) => {
      if (error) {
        console.log("error", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify(servers));
    });
});

app.post("/delete-server", upload.none(), (req, res) => {
  console.log("/delete-servers endpoint hit");
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

app.post("/add-server", upload.none(), (req, res) => {
  console.log("/add-server endpoint hit");
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

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});

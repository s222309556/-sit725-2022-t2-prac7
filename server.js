var express = require("express");
var app = express();

// mongodb connection
const { MongoClient } = require("mongodb");
// add database connections
const uri =
  "mongodb+srv://admin:admin@cluster0.3lflt16.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let dbCollection;

// let router = require("./route/route");
let http = require("http").createServer(app);
let io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 10));
  }, 1000);
});

const cardList = [
  {
    title: "Kitten 2",
    image: "images/kitten-2.jpg",
    link: "About Kitten 2",
    desciption: "Demo description about kitten 2",
  },
  {
    title: "Kitten 3",
    image: "images/kitten-3.jpg",
    link: "About Kitten 3",
    desciption: "Demo description about kitten 3",
  },
];

app.get("/api/cats", (req, res) => {
  getAllCats((err, result) => {
    if (err) {
      res.json({ statusCode: 400, message: err });
    } else {
      res.json({ statusCode: 200, data: result, message: "Successful" });
    }
  });
});

function dbConnection(collectionName) {
  client.connect((err) => {
    dbCollection = client.db().collection(collectionName);
    if (!err) {
      console.log("DB Connected");
      // console.log(dbCollection);
    } else {
      console.error(err);
    }
  });
}

// post api
app.post("/api/cats", (req, res) => {
  let cat = req.body;
  insert(cat, (err, result) => {
    if (err) {
      res.json({ statusCode: 400, message: err });
    } else {
      res.json({
        statusCode: 200,
        data: result,
        message: "Cat Successfully Added",
      });
    }
  });
});

function insert(cat, callback) {
  dbCollection.insertOne(cat, callback);
}

function getAllCats(callback) {
  dbCollection.find().toArray(callback);
}

var port = process.env.port || 3000;

http.listen(port, () => {
  console.log("App listening to: " + port);
  dbConnection("Cats");
});

// socket io library
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

const db = require("./queries");

// serial library
const SerialPort = require("serialPort");
const Readline = SerialPort.parsers.Readline; // use parsers library to read data from serial port
const parser = new Readline();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const mySerial = new SerialPort(
  "/COM4",
  {
    baudRate: 9600,
  },
  false
);

mySerial.pipe(parser);
parser.on("data", console.log);

mySerial.on("data", (data) => {
  console.log(data.toString());
  io.emit("data", data.toString());
  db.addData(data.toString());
});

mySerial.on("open", () => {
  console.log(`Serial port opened`);
});

// socket io server
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/page/index.html");
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// reads data and converts to node
// mySerial.on("data", (data) => {
//   setTimeout(() => {}, 500);
//   const unixTime = data;
//   const millis = unixTime * 1000;
//   const dateObj = new Date(millis);
//   const humanDate = dateObj.toLocaleString();
//   console.log(typeof data);
//   console.log(data);
//   console.log(humanDate);
//   io.emit("data", humanDate);
// });

app.get("/motion", db.getData);
// http.get("/motion/:id", db.getDataById);
// http.post("/motion", db.createData);
// http.put("/motion/:id", db.updateData);
// http.delete("/motion/:id", db.deleteData);

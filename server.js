const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./src/model/UserModel");
const makeFolder = require("./src/utils/create-image-from-qr");
const generateQrs = require("./src/utils/generate-qr");
const sendMail = require("./src/utils/send-email");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const Email = require("email-templates");
var cors = require("cors");

// mongoose.connect("mongodb://localhost:27017/login-app-db", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });
const mongoConnection = () => {
  // return mongoose.connect(url.mongo_url, {
  // const uri = "mongodb://localhost:27017/event-db"
  const uri =
    "mongodb+srv://Ghimmy:sweet@ghimmycluster.7gwtp.mongodb.net/event-db?retryWrites=true&w=majority";
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

//Generate template (Example: templates/emails/demo/index.pug)
var template = path.join(__dirname, "templates/emails", "demo");
var email = new Email({ views: { root: template } });
var locals = { email: "myemail@gmail.com", username: "CompaCode" };

const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
makeFolder(); // create folder for qr images

app.post("/api/create", async (req, res) => {
  try {
    console.log("req", req?.body);
    const { username, email, phone, sex, qrcode } = req?.body;
    const response = await User.create({
      username,
      email,
      phone,
      sex,
      qrcode,
      // eventId,
      registered: false,
    });
    res.json({ status: "User Created Succesfully" });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e.message.toString().includes("duplicate")
        ? "You are registered for the event already"
        : e.message.split(":")[0], // check if duplicate message exist
    });
    console.log("error", e.message);
    // throw error
  }
});

app.put("/api/register", async (req, res) => {
  try {
    console.log("req", req?.body);
    const { username, email, phone, sex, qrcode } = req?.body;

    let user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Sorry, you cannot register for this event.");
      console.log("useressarror", error);
      throw error;
    }
    if (user && user.registered === true) {
      const error = new Error("You are registered for the event already");
      console.log("useressarror", error);
      throw error;
    }
    // let phoneN = await User.findOne({ phone });
    // if (!phoneN) {
    //   const error = new Error("Sorry, you are not invited for this event.");
    //   console.log("phoneessarror", error);
    //   throw error;
    // }
    // const qr = 12
    const qr = user._id;

    // const gene = await generateQrs()(qr);
    let img = await QRCode.toDataURL(qr);

    const data = {
      img,
      user,
    };

    user.username = username;
    user.sex = sex;
    user.registered = true;

    await user.save();
    sending = await sendMail(data).catch(console.error);
    res.json({ status: "Registration Succesfull", data: user });
  } catch (e) {
    console.log("e", e);
    res.status(400).json({
      status: false,
      message: e.message.toString(),
    });
  }
});

app.use("/", (req, res, next) =>
  res.status(404).json({ message: "Page not found." })
);

mongoConnection()
  .then((result) => {
    // mongoConnection.User.createIndex({ userId: 1 }, { unique: true });
    app.listen(5000, () => {
      console.log(`server starting on port: ${5000}`);
    });
  })
  .catch((error) => console.log("Mongo connection error", error));

require("dotenv").config();
const express = require("express");
const cookieparser = require("cookie-parser");


require("./connection");
const app = express();
const port = process.env.PORT || 5000;
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require("./models/commentModel");
require("./models/postModel");
require("./models/userModel");
app.use(require("./routes/postRoutes"));
app.use(require("./routes/userRoutes"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

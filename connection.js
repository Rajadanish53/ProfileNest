const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection to db successfull");
  });

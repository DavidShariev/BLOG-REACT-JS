import express from "express";

const app = express();
const port = 4444;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is started");
});

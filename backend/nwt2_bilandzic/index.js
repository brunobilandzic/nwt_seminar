const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const User = require("./User");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
const PORT = 3001;

mongoose
  .connect(
    "mongodb+srv://admin_flwhoolb:lopataiveslo@custer0.5teiq.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.use(bodyParser.json());

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

app.post("/api/users", async (req, res) => {
  const user = new User(req.body);
  await User.create(user);
});

app.put("/api/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  await user.save();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

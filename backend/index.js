const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const User = require("./User");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3001;
const jwt = require("jsonwebtoken");
const Manufacturer = require("./Manufacturer");
const jwtKey = "my_secret_key";
const Model = require("./Model");
const seedDB = require("./seedDB");
mongoose
  .connect(
    "mongodb+srv://admin_flwhoolb:lopataiveslo@custer0.5teiq.mongodb.net/nwt_seminar?retryWrites=true&w=majority",
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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

function verifyUser(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, jwtKey);

    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

function verifyAdmin(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, jwtKey);
    if (!verified.isAdmin) return res.status(403).send("Access Denied");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

app.get("/api/seed", async (req, res) => {
  await seedDB();
  res.send("Database seeded!");
});

app.get("/api/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ username: 1 });
  res.json(users);
});

app.post("/api/manufacturers", verifyAdmin, async (req, res) => {
  const manufacturer = new Manufacturer(req.body);
  const createdManufacturer = await Manufacturer.create(manufacturer);
  res.status(201).json(createdManufacturer);
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

app.get("/api/manufacturers", async (req, res) => {
  const manufacturers = await Manufacturer.find().sort({ name: 1 });
  res.json(manufacturers);
});
 
app.get("/api/manufacturers/:id", async (req, res) => {
  const manufacturer = await Manufacturer.findById(req.params.id).populate(
    "models"
  );
  res.json(manufacturer);
});

app.delete("/api/manufacturers/:id", verifyAdmin, async (req, res) => {
  const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);

  if (!manufacturer)
    return res.status(404).json({ message: "Manufacturer not found" });

  manufacturer.models.forEach(async (modelId) => {
    await Model.findByIdAndDelete(modelId);
  });

  res.json({ message: "Manufacturer deleted" });
});

app.put("/api/manufacturers/:id", verifyAdmin, async (req, res) => {
  const body = req.body;
  const manufacturer = {
    name: body.name,
    location: body.location,
    logo: body.logo,
    models: body.models,
  };
  const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
    req.params.id,
    manufacturer,
    { new: true }
  );
  req.body.models.forEach(async (modelId) => {
    const model = await Model.findById(modelId);
    if (model) {
      model.manufacturer = req.params.id;
      await model.save();
    }
  });
  res.json(updatedManufacturer);
});

app.get("/api/models", async (req, res) => {
  const models = await Model.find().populate("manufacturer").sort({ name: 1 });
  res.json(models);
});

app.get("/api/models/:id", async (req, res) => {
  const model = await Model.findById(req.params.id);
  res.json(model);
});

app.delete("/api/models/:id", verifyAdmin, async (req, res) => {
  await Model.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.post("/api/models", verifyAdmin, async (req, res) => {
  const model = new Model(req.body);
  const manufacturer = await Manufacturer.findById(req.body.manufacturer);
  const createdModel = await Model.create(model);

  manufacturer?.models.push(createdModel);

  await manufacturer?.save();

  res.status(201).json(createdModel);
});

app.put("/api/models/:id", verifyAdmin, async (req, res) => {
  const body = req.body;
  const model = {
    name: body.name,
    year: body.year,
    manufacturer: body.manufacturer,
  };
  const updatedModel = await Model.findByIdAndUpdate(req.params.id, model, {
    new: true,
  });
  res.json(updatedModel);
});

app.post("/api/register", async (req, res) => {
  const user = new User(req.body);
  await User.create(user);

  const userForToken = {
    username: user.username,
    id: user._id,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(userForToken, jwtKey, {
    expiresIn: "1000000000000000s",
  });
  res.json({
    token,
    user: userForToken,
  });
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.json({ message: "Invalid username or password" });

  if (user.password !== req.body.password)
    return res.json({ message: "Invalid username or password" });

  const userForToken = {
    username: user.username,
    id: user._id,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(userForToken, jwtKey, {
    expiresIn: "1000000000000000s",
  });
  res.json({
    token,
    user: userForToken,
  });
});

app.put("/api/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  await user.save();
});

app.get("/api/user", verifyUser, async (req, res) => {
  console.log("Feching user");
  console.log(req.user);
  res.json({
    username: req.user.username,
    id: req.user.id,
    isAdmin: req.user.isAdmin,
    token: req.header("Authorization")?.split(" ")[1],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

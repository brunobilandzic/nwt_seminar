const Manufacturer = require("./Manufacturer");
const Model = require("./Model");
const User = require("./User");

const data = require("./seedData.json");

async function seedManufacturers() {
  await Manufacturer.deleteMany({});

  for (let manufacturerData of data.seedData.manufacturers) {
    const manufacturer = new Manufacturer(manufacturerData);
    await manufacturer.save();
  }

  console.log("Manufacturers seeded!");
}

async function seedModels() {
  await Model.deleteMany({});

  const manufacturers = await Manufacturer.find();

  const ids = manufacturers?.map((manufacturer) => manufacturer._id);

  for (let modelData of data.seedData.models) {
    const model = new Model(modelData);
    const id = ids[Math.floor(Math.random() * ids.length)];
    model.manufacturer = id;
    const manufacturer = await Manufacturer.findById(id);
    manufacturer.models.push(model);
    await manufacturer.save();
    await model.save();
  }

  console.log("Models seeded!");
}

async function seedUsers() {
  await User.deleteMany({});

  for (let userData of data.seedData.users) {
    const user = new User(userData);
    await user.save();
  }

  console.log("Users seeded!");
}

async function seedDB() {
  await seedManufacturers();
  await seedModels();
  await seedUsers();
}

module.exports = seedDB;

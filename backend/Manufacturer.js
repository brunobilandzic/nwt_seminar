const mongoose = require("mongoose");
const { Schema } = mongoose;


const manufacturerSchema = new Schema({
    name: { type: String, default: "manufacturer" },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    models: [{ type: Schema.Types.ObjectId, ref: "Model" }],
});
    
const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

module.exports = Manufacturer;
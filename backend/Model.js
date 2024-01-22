const mongoose = require('mongoose');
const { Schema } = mongoose;

const modelSchema = new Schema({
    name: { type: String, default: "model" },
    description: { type: String, default: "" },
    manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer" },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
});
    
const Model = mongoose.model("Model", modelSchema);

module.exports = Model;
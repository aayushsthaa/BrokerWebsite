const mongoose = require ("mongoose");
const propertySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images:Array.of(String),
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Property = mongoose.model("Property", propertySchema)
module.exports = Property
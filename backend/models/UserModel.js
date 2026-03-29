const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: false,
            select: false
        },
        role:{
            type: String,
            enum: ["Broker", "Buyer"],
            default: "Buyer",
        },
        savedProperties: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property"
        }]
    }
);


const User = mongoose.model("User", UserSchema);
module.exports = User;
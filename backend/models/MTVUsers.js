const mongoose = require('mongoose');

const mtvUserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, required: true },
    referralCode: { type: String, required: false },
    referralType: { type: String, required: false },
    registerType: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("MTVUser", mtvUserSchema, "MTVUsers");

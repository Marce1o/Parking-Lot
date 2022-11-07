"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Registry = new Schema({
    uid: Number,
    plate: String,
    checkIn: String,
    checkOut: String
});

module.exports = mongoose.model('Registry', Registry);
"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToCharge = new Schema({
    uid: Number,
    plate: String,
    minutes: String
});

module.exports = mongoose.model('ToCharge', ToCharge);
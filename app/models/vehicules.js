"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vehicules = new Schema({
    uid: Number,
    plate: String,
    type: String
});

module.exports = mongoose.model('Vehicules', Vehicules);
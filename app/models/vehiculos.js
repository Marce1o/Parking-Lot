"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vehiculos = new Schema({
    uid: String,
    plate: String,
    type: String
});

module.exports = mongoose.model('Vehiculos', Vehiculos);
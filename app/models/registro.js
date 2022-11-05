"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Registro = new Schema({
    uid: String,
    plate: String,
    checkIn: String,
    checkOut: String
});

module.exports = mongoose.model('Registro', Registro);
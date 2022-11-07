var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const config = require('./database/config.js');
var router = require('express').Router();

const alta = require("./user/alta.js")
const entrada = require("./user/entrada.js");
const salida = require("./user/salida.js");
const comienzaMes = require("./user/comienzaMes.js");
const pagoDeResidentes = require("./user/pagoDeResidentes.js");

var db;
var port = 8080;

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if (err) {
        return console.log(`Mongo no listo: ${err}`);
    }
    app.listen(port)
     
});

app.use(cors());
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/server', router);
app.post('/server/alta/',alta.alta);
app.post('/server/entrada/',entrada.entrada);
app.post('/server/salida/',salida.salida);
app.delete('/server/comienzaMes/',comienzaMes.comienzaMes);
app.get('/server/pagoDeResidentes/',pagoDeResidentes.pagoDeResidentes);


console.log(`Server listening on port ${port}`);
module.exports = {mongoose, db, port};
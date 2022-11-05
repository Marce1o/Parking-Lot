var express = require('express')
var app = express()
var router = require('./routes') 
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const config = require('./database/config.js')
app.use(cors());
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const alta = require("./user/alta.js")
const entrada = require("./user/entrada.js");
const salida = require("./user/salida.js");
const comienzaMes = require("./user/comienzaMes.js");
const pagoDeResidentes = require("./user/pagoDeResidentes.js");

app.use('/server', router);
app.put('/server/alta/',alta.alta);
app.put('/server/entrada/',entrada.entrada);
app.put('/server/salida/',salida.salida);
app.patch('/server/comienzaMes/',comienzaMes.comienzaMes);
app.get('/server/pagoDeResidentes/',pagoDeResidentes.pagoDeResidentes);

var db;

console.clear();

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if (err) {
        return console.log(`Mongo no listo: ${err}`);
    }
    app.listen(8080)
     
}) 

console.log('Servidor en espera')
  
module.exports = {mongoose, db};

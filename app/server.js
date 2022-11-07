var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const config = require('./database/config.js');
var router = require('express').Router();

const NewPlate = require("./user/newPlate.js")
const Entrance = require("./user/entrance.js");
const Exit = require("./user/exit.js");
const MonthStart = require("./user/monthStart.js");
const ResidentsBill = require("./user/residentsBill.js");

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
app.post('/server/newPlate/',NewPlate.newPlate);
app.post('/server/entrance/',Entrance.entrance);
app.post('/server/exit/',Exit.exit);
app.delete('/server/monthStart/',MonthStart.monthStart);
app.get('/server/residentsBill/',ResidentsBill.residentsBill);

console.log(`Server listening on port ${port}`);
module.exports = {mongoose, db, port};
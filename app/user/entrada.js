const Registro = require('../models/registro.js');
const Vehiculos = require('../models/vehiculos.js');

async function entrada(req,res){
    let body = JSON.stringify(req.body);
  
    try{
       body =  JSON.parse(body);
    }catch{
        res.status(400).send('Input error: Not a JSON');
        return;
    }

    if(!body.hasOwnProperty('plate')){
        res.status(400).send('Input error: Missing plate');
        return;
    }

    body.plate = body.plate.toUpperCase();

    if(!(await Vehiculos.findOne({plate:body.plate}))){
        res.status(418).send(`${body.plate} plate is not in registry!`);
        return;
    }

    if(await Registro.findOne({plate:body.plate, checkOut : {"$exists" : false}})){
        res.status(418).send(`${body.plate} already in!`);
        return;
    }

    let record = new Registro({
        uid : await Registro.find({}).count(),
        plate : body.plate,
        checkIn : Math.floor(Date.now()/1000/60)
    });

    await record.save();

    let output = `${body.plate} checked in!`;
    res.status(202).send(output);
}

module.exports ={
    entrada
}

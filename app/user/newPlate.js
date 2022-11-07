const Vehicules = require('../models/vehicules.js');

async function newPlate(req,res){
    let body = JSON.stringify(req.body);
  
    try{
       body =  JSON.parse(body);
    }catch{
        res.status(400).send('Input error: Not a JSON');
        return;
    }

    if(!body.hasOwnProperty('plate')||!body.hasOwnProperty('type')){
        if(!body.hasOwnProperty('plate')&&!body.hasOwnProperty('type')){
            res.status(400).send('Input error: Missing plate and type');
            return;
        }
        if(!body.hasOwnProperty('plate')){
            res.status(400).send('Input error: Missing plate');
            return;
        }
        if(!body.hasOwnProperty('type')){
            res.status(400).send('Input error: Missing type');
            return;
        }
    }

    body.type = body.type.toLowerCase();
    body.plate = body.plate.toUpperCase();

    if(body.type != 'official' && body.type != 'resident'  && body.type != 'notresident'){
        res.status(400).send(`${body.type} is not a valid type. Valid types are: Official, Resident and notResident`);
        return;
    }

    if(await Vehicules.findOne({plate:body.plate})){
        res.status(418).send(`${body.plate} plate is already in registry`);
        return;
    }

    let Vehicules = new Vehicules({
        uid : await Vehicules.find({}).count(),
        plate : body.plate,
        type : body.type
    });

    Vehicules.save();

    let output = `Set up for ${body.type} Vehicules with plate ${body.plate} was done successfully!`;
    res.status(201).send(output);
}

module.exports = { newPlate };

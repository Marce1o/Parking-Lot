const Vehiculo = require('../models/vehiculos.js');

async function alta(req,res){
    console.clear();
    req = JSON.stringify(req.body);
  
    try{
       var req =  JSON.parse(req);
    }catch{
        res.status(400).send('Input error: Not a JSON');
        return;
    }

    if(!req.hasOwnProperty('plate')||!req.hasOwnProperty('type')){
        if(!req.hasOwnProperty('plate')&&!req.hasOwnProperty('type')){
            res.status(400).send('Input error: Missing plate and type');
            return;
        }
        if(!req.hasOwnProperty('plate')){
            res.status(400).send('Input error: Missing plate');
            return;
        }
        if(!req.hasOwnProperty('type')){
            res.status(400).send('Input error: Missing type');
            return;
        }
    }

    req.type = req.type.toLowerCase();
    req.plate = req.plate.toUpperCase();

    if(req.type != 'official' && req.type != 'resident'  && req.type != 'notresident'){
        res.status(400).send(`${req.type} is not a valid type. Valid types are: Official, Resident and notResident`);
        return;
    }

    if(await Vehiculo.findOne({plate:req.plate})){
        res.status(418).send(`${req.plate} plate is already in registry`);
        return;
    }

    var vehicule = new Vehiculo({
        uid : await vehiculesLength(),
        plate : req.plate,
        type : req.type
    });

    vehicule.save();

    let output = `Set up for ${req.type} vehicule with plate ${req.plate} was done successfully!`;
    console.log(output);
    res.status(201).send(output);

    async function vehiculesLength(){
        return await Vehiculo.find({}).count();
    }
}

module.exports ={
    alta
}

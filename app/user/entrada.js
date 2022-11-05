const Registro = require('../models/registro.js');
const Vehiculos = require('../models/vehiculos.js');

async function entrada(req,res){
    console.clear();
    req = JSON.stringify(req.body);
  
    try{
       var req =  JSON.parse(req);
    }catch{
        res.status(400).send('Input error: Not a JSON');
        return;
    }

    if(!req.hasOwnProperty('plate')){
        res.status(400).send('Input error: Missing plate');
        return;
    }

    req.plate = req.plate.toUpperCase();

    if(!(await Vehiculos.findOne({plate:req.plate}))){
        res.status(418).send(`${req.plate} plate is not in registry!`);
        return;
    }

    if(await Registro.findOne({plate:req.plate, checkOut : {"$exists" : false}})){
        res.status(418).send(`${req.plate} already in!`);
        return;
    }

    var record = new Registro({
        uid : await registryLength(),
        plate : req.plate,
        checkIn : Math.floor(Date.now()/1000/60)
    });

    await record.save();

    let output = `${req.plate} checked in!`;
    console.log(output);
    res.status(202).send(output);

    async function registryLength(){
        return await Registro.find({}).count();
    }
}

module.exports ={
    entrada
}

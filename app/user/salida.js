const Registro = require('../models/registro.js');
const Vehiculos = require('../models/vehiculos.js');
const PorCobrar= require('../models/porCobrar.js');

async function salida(req,res){
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

    if(!(await Registro.findOne({plate:req.plate, checkOut : {"$exists" : false}}))){
        res.status(418).send(`${req.plate} is not in the parking lot!`);
        return;
    }

    var old = await Registro.findOne({plate:req.plate, checkOut : {"$exists" : false}});
    old.checkOut=Math.floor(Date.now()/1000/60);

    await Registro.replaceOne({uid:old.uid},old);

    let newMinutes = old.checkOut - old.checkIn;

    if((await Vehiculos.findOne({plate:req.plate})).type == 'notresident'){
        let bill = {
            plate : req.plate,
            minutes : newMinutes,
            toCharge : newMinutes * 0.5
        }
        let header = `Núm. placa\t\tTiempo estacionado (min.)\tCantidad a pagar`;
        let notResidentsBill = `\n${bill.plate}\t\t\t${bill.minutes}\t\t\t\t$${bill.minutes*0.5}`;
        let file = header+=(notResidentsBill);
        res.status(202).send(bill);
        return;
    }

    if((await Vehiculos.findOne({plate:req.plate})).type == 'resident'){
        var bill = await PorCobrar.findOne({plate:req.plate});
        if(bill){
            bill.minutes = parseInt(bill.minutes) + (newMinutes);
            await PorCobrar.replaceOne({uid:bill.uid},bill);
        }else{
            bill = new PorCobrar({
                uid : await billLength(),
                plate : req.plate,
                minutes : newMinutes
            });
            bill.save();
        }
    }

    let output = `${req.plate} checked out!`;
    res.status(202).send(output);

    async function billLength(){
        return await PorCobrar.find({}).count();
    }
}

module.exports ={
    salida
}

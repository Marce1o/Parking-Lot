const Vehiculos = require('../models/vehiculos.js');
const PorCobrar= require('../models/porCobrar.js');

async function pagoDeResidentes(req,res){

    req = JSON.stringify(req.body);
  
    try{
       var req =  JSON.parse(req);
    }catch{
        res.status(400).send('Input error: Not a JSON');
        return;
    }

    if(!req.hasOwnProperty('filename')){
        res.status(400).send(`Input error: Missing filename or invalid key. Key name should be "filename"`);
        return;
    }

    let filename = req.filename.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '');

    let residents = await Vehiculos.find({type:'notresident'});
    let residentsBill = [];
    let bills = [];
 
    for(let i = 0; i<residents.length; i++){
        console.log(`${progressBar(i,notResidents.length)}`);
        let resident = await PorCobrar.findOne({plate:residents[i].plate});
        if(!resident){
            continue;
        }
        let bill = {
            plate : residents[i].plate,
            time : resident.minutes,
            toCharge : parseFloat((resident.minutes) * 0.05).toFixed(2)
        }
        residentsBill.push(`\n${bill.plate}\t\t\t${bill.time}\t\t\t\t$${bill.toCharge}`);
        bills.push(bill);
    }

    let header = `${filename}.txt\nNúm. placa\t\tTiempo estacionado (min.)\tCantidad a pagar`;
    let file = header+=residentsBill;
    console.clear();
    console.log(file);

    res.status(200).send(bills);
}

module.exports ={
    pagoDeResidentes
}

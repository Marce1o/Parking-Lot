const Vehicules = require('../models/vehicules.js');
const ToCharge = require('../models/toCharge.js');

async function residentsBill(req,res){
    let body = JSON.stringify(req.body);
  
    try{
       body = JSON.parse(body);
    }catch{
        res.status(400).send('Input error: Not a JSON');
        return;
    }

    let residents = await Vehicules.find({type:'resident'});
    let bills = [];
 
    for(let i = 0; i<residents.length; i++){
        let resident = await ToCharge.findOne({plate:residents[i].plate});
        if(!resident){
            continue;
        }
        let bill = {
            plate : residents[i].plate,
            time : resident.minutes,
            toCharge : parseFloat((resident.minutes) * 0.05).toFixed(2)
        }
        bills.push(bill);
    }

    res.status(200).send(bills);
}

module.exports = { residentsBill };

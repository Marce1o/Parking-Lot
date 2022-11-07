const Registry = require('../models/registry.js');
const Vehicules = require('../models/vehicules.js');
const ToCharge = require('../models/toCharge.js')

async function monthStart(req,res){

    //borrado del Registry de Vehicules oficiales
    let cars = await Vehicules.find({type:'official'});
    for(let i = 0; i<cars.length; i++){
        await Registry.deleteMany({plate:cars[i].plate});
    }

    //reindexado de la tabla
    let afterSize = await Registry.find({}).count();
    let indexes = await Registry.find({},{"uid":1,"_id":0});
    for(let i = 0; i<afterSize; i++){
        let temp = await Registry.findOne({uid:indexes[i].uid});
        temp.uid = i;
        await Registry.replaceOne({uid:indexes[i].uid},temp);
    }

    //el tiempo de estacionado de los residentes se establece a cero
    cars = await Vehicules.find({type:'resident'});
    for(let i = 0; i<cars.length; i++){
        let temp = await ToCharge.findOne({plate:cars[i].plate});
        temp.minutes = 0;
        await ToCharge.replaceOne({uid:temp.uid},temp);
    }
    console.clear();
    res.status(200).send('Monthly restart done!');
}

module.exports = { monthStart };

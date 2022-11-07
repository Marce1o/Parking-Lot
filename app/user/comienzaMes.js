const Registro = require('../models/registro.js');
const Vehiculos = require('../models/vehiculos.js');
const PorCobrar= require('../models/porCobrar.js')

async function comienzaMes(req,res){

    //borrado del registro de vehiculos oficiales
    let cars = await Vehiculos.find({type:'official'});
    for(let i = 0; i<cars.length; i++){
        await Registro.deleteMany({plate:cars[i].plate});
    }

    //reindexado de la tabla
    let afterSize = await Registro.find({}).count();
    let indexes = await Registro.find({},{"uid":1,"_id":0});
    for(let i = 0; i<afterSize; i++){
        let temp = await Registro.findOne({uid:indexes[i].uid});
        temp.uid = i;
        await Registro.replaceOne({uid:indexes[i].uid},temp);
    }

    //el tiempo de estacionado de los residentes se establece a cero
    cars = await Vehiculos.find({type:'resident'});
    for(let i = 0; i<cars.length; i++){
        let temp = await PorCobrar.findOne({plate:cars[i].plate});
        temp.minutes = 0;
        await PorCobrar.replaceOne({uid:temp.uid},temp);
    }
    console.clear();
    res.status(200).send('Monthly restart done!');
}

module.exports ={
    comienzaMes
}

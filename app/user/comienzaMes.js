const Registro = require('../models/registro.js');
const Vehiculos = require('../models/vehiculos.js');
const PorCobrar= require('../models/porCobrar.js')

async function comienzaMes(req,res){
    console.clear();
    console.log('Iniciando...')

    //borrado del registro de vehiculos oficiales
    let cars = await Vehiculos.find({type:'official'});
    for(let i = 0; i<cars.length; i++){
        console.log(`Stage 1.1 => ${progressBar(i,cars.length)}`)
        await Registro.deleteMany({plate:cars[i].plate});
    }

    //reindexado de la tabla
    let afterSize = await registryLength();
    let indexes = await Registro.find({},{"uid":1,"_id":0});
    for(let i = 0; i<afterSize; i++){
        console.log(`Stage 1.2 => ${progressBar(i,afterSize)}`)
        let temp = await Registro.findOne({uid:indexes[i].uid});
        temp.uid = i;
        await Registro.replaceOne({uid:indexes[i].uid},temp);
    }
    
    //el tiempo de estacionado de los residentes se establece a cero
    cars = await Vehiculos.find({type:'resident'});
    for(let i = 0; i<cars.length; i++){
        console.log(`Stage 2 => ${progressBar(i,cars.length)}`)
        let temp = await PorCobrar.findOne({plate:cars[i].plate});
        console.log(temp)
        temp.minutes = 0;
        await PorCobrar.replaceOne({uid:temp.uid},temp);
    }
    console.clear();
    console.log('Monthly restart done!');
    res.status(200).send('Monthly restart done!');
    
    function progressBar(current, target){
        console.clear();
        var progress = (current/target)*60; 
        var bar = `${Math.round(((current+1)/target)*100)}% `;
        for(let i = 0; i<progress; i++)  
            bar+=' '; 
        bar+='🟡';
        for(let i = progress+2; i<60; i++)
            bar+='•';
        bar += ' 100% ' + current;
        return(bar);
    }

    async function registryLength(){
        return await Registro.find({}).count();
    }
    async function vehiculesLength(){
        return await Vehiculos.find({}).count();
    }
}

module.exports ={
    comienzaMes
}

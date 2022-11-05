var router = require('express').Router()
const res = require('express/lib/response')

router.get('/', function (req,res){
    res.status(200).json('conectado')
})

const { application } = require('express')

module.exports = router
var port = require('../server');
module.exports = {
    port: process.env.PORT || port,
    db: process.env.MONGODB || 'mongodb://localhost:27017/parkingLot'
}

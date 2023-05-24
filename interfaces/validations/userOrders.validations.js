const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    idUser: joi.number().integer().positive().label('idUser'),
    idOrder: joi.number().integer().positive().label('idOrder'),
    idUserLocations: joi.number().integer().positive().label('idUserLocations')
}).messages(joiMessages);
const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idOrder: joi.number().integer().positive().label('idOrder'),
    idUser: joi.number().integer().positive().label('idUser'),
    idDeliveryStatus: joi.number().integer().positive().label('idDeliveryStatus'),
}).messages(joiMessages);
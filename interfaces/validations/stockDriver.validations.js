const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idUser: joi.number().integer().positive().label('idOrder'),
    idProducts: joi.number().integer().positive().label('idProducts')
}).messages(joiMessages);
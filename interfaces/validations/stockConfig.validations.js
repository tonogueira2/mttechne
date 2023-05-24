const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idProducts: joi.number().integer().positive().label('idProducts'),
    quantity: joi.number().integer().positive().label('quantity'),
}).messages(joiMessages);
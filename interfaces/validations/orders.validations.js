const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idOrderStatus: joi.number().integer().positive().label('idOrderStatus'),
    idPayment: joi.string().allow(null).optional().label('idPayment'),
    idUser: joi.number().integer().positive().optional().label('id'),
    idProducts: joi.array().items(joi.number().integer().positive()).optional().label('ids products')
}).messages(joiMessages);
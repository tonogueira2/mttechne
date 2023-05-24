const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idDelivery: joi.number().integer().positive().label('idDelivery'),
    location: joi.string().required().label('location'),
}).messages(joiMessages);
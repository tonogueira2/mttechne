const joi = require('@hapi/joi');
const joiMessages = require('../../config/joi-messages.json');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    idUser: joi.number().integer().positive().label('idOrder'),
    latitude: joi.string().required().label('latitude'),
    longitude: joi.string().required().label('longitude')
}).messages(joiMessages);